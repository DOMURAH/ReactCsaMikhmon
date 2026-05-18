"""
Router FastAPI amélioré — même logique métier que l'original.
Copier ce fichier vers votre projet backend (ex. routers/main.py).
"""
from __future__ import annotations

import os
import tempfile
from datetime import date, datetime, time
from typing import Any
from uuid import uuid4

import pandas as pd
from dotenv import load_dotenv
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from supabase import create_client

from routerOS import get_active_connections, get_all_users

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

router = APIRouter()

# --- Constantes métier (inchangées) ---
PROFILE_PRICES: dict[str, int] = {
    "1H": 500,
    "2h": 1000,
    "3mois": 40000,
    "500Ar-45min": 500,
    "1000Ar-1h30": 1000,
}

MIDNIGHT = time(0, 0, 0)
COMMENT_UP_PATTERN = r"up-\d*-(\d{2})\.(\d{2})\.(\d{2})-"


# --- Utilitaires CSV / API ---

def _read_uploaded_csv(file: UploadFile) -> pd.DataFrame:
    try:
        return pd.read_csv(file.file, skiprows=1)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"CSV invalide : {exc}") from exc


def _build_api_dataframe(all_user: list[dict[str, Any]]) -> pd.DataFrame:
    df_api = pd.DataFrame(all_user)

    df_api["Username"] = df_api["name"].astype(str).str.lower()
    comment_str = df_api["comment"].fillna("").astype(str)

    iso_dt = pd.to_datetime(comment_str, format="%Y-%m-%d %H:%M:%S", errors="coerce")

    mm_dd_yy = comment_str.str.extract(COMMENT_UP_PATTERN)
    mm, dd, yy = mm_dd_yy[0], mm_dd_yy[1], mm_dd_yy[2]
    y_full = yy.apply(lambda x: f"20{x}" if pd.notna(x) else None)

    reconstructed_date = pd.to_datetime(
        y_full.astype(str) + "-" + mm.astype(str) + "-" + dd.astype(str),
        errors="coerce",
    )

    df_api["comment_parsed"] = iso_dt.fillna(reconstructed_date)
    df_api["api_date"] = df_api["comment_parsed"].dt.date
    df_api["api_time"] = df_api["comment_parsed"].dt.time
    df_api["Price"] = df_api["profile"].map(PROFILE_PRICES).fillna(0)

    return df_api


def _merge_api_users_into_df(df: pd.DataFrame, df_api: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    df = df.copy()
    df["№"] = df["№"].astype(int)
    existing_usernames = set(df["Username"].str.lower())

    new_mask = ~df_api["Username"].isin(existing_usernames)
    new_df = df_api[new_mask].copy()

    appended_count = 0
    if len(new_df) > 0:
        next_no = int(df["№"].max()) + 1
        new_df["№"] = range(next_no, next_no + len(new_df))
        new_df["Date"] = new_df["api_date"]
        new_df["Time"] = new_df["api_time"]
        new_df["Profile"] = new_df["profile"]
        new_df["Comment"] = new_df["comment"]
        new_selected = new_df[["№", "Date", "Time", "Username", "Profile", "Comment", "Price"]]
        df = pd.concat([df, new_selected], ignore_index=True)
        appended_count = len(new_df)

    return df, appended_count


def _load_and_merge_csv(file: UploadFile) -> tuple[pd.DataFrame, int, list[dict[str, Any]]]:
    df = _read_uploaded_csv(file)
    all_user = get_all_users()
    df_api = _build_api_dataframe(all_user)
    df, appended_count = _merge_api_users_into_df(df, df_api)
    return df, appended_count, all_user


def _filter_rows_after_midnight(df: pd.DataFrame) -> pd.DataFrame:
    """Ne garde que les lignes dont Time > 00:00:00 (logique d'origine)."""
    out = df.copy()
    out["Time_parsed"] = pd.to_datetime(out["Time"], format="%H:%M:%S", errors="coerce").dt.time
    return out[out["Time_parsed"] > MIDNIGHT]


def _safe_float(value: Any) -> float:
    return 0.0 if pd.isna(value) else float(value)


def _prepare_df_with_api(file: UploadFile) -> tuple[pd.DataFrame, int]:
    df, appended_count, _ = _load_and_merge_csv(file)
    return df, appended_count


# --- Routes ---

@router.get("/")
def home() -> dict[str, str]:
    return {"message": "Bienvenue dans notre jeux"}


@router.post("/process")
def process(file: UploadFile = File(...)) -> dict[str, Any]:
    df, appended_count, all_user = _load_and_merge_csv(file)

    data_now = datetime.now().date()
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

    df_today = df[df["Date"].dt.date == data_now]
    df_today = _filter_rows_after_midnight(df_today)

    total_now = df_today["Price"].sum()
    total_all = df["Price"].sum()
    number_of_rows = len(df)
    all_name = df["Username"].tolist()

    return {
        "appended": appended_count,
        "total_now": _safe_float(total_now),
        "total_all": _safe_float(total_all),
        "number_of_rows": int(number_of_rows),
        "all_name": all_name,
        "user_upload": all_user,
    }


@router.post("/date_precis")
def filter_by_date(
    file: UploadFile = File(...),
    textData: str | None = Form(default=None),
    textData2: str | None = Form(default=None),
    textData3: str | None = Form(default=None),
    filterType: str = Form(...),
) -> dict[str, Any]:
    df, _ = _prepare_df_with_api(file)

    if filterType == "date_precis":
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        date_sent = datetime.strptime(textData, "%Y-%m-%d").date()
        df_filtered = df[df["Date"].dt.date == date_sent]
        df_filtered = _filter_rows_after_midnight(df_filtered)

        return {
            "date_recus": textData,
            "total": float(df_filtered["Price"].sum()),
            "number": len(df_filtered),
        }

    if filterType == "mois":
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        month_sent = int(textData)
        df_filtered = df[df["Date"].dt.month == month_sent]
        df_filtered = _filter_rows_after_midnight(df_filtered)

        return {
            "date_recus": textData,
            "total": float(df_filtered["Price"].sum()),
            "number": len(df_filtered),
        }

    if filterType == "intervalle_de_dates":
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        start_date = datetime.strptime(textData2, "%Y-%m-%d").date()
        end_date = datetime.strptime(textData3, "%Y-%m-%d").date()

        df_filtered = df[
            (df["Date"].dt.date >= start_date) & (df["Date"].dt.date <= end_date)
        ]
        df_filtered = _filter_rows_after_midnight(df_filtered)

        return {
            "date_recus": f"{textData2} → {textData3}",
            "total": float(df_filtered["Price"].sum()),
            "number": len(df_filtered),
        }

    raise HTTPException(status_code=400, detail=f"filterType inconnu : {filterType}")


@router.post("/upload")
async def upload(file: UploadFile = File(...)) -> dict[str, str]:
    filename = f"{uuid4()}.csv"
    content = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as f:
            supabase.storage.from_("reports").upload(
                path=filename,
                file=f,
                file_options={"content_type": "text/csv"},
            )
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    file_url = supabase.storage.from_("reports").get_public_url(filename)
    return {"file_url": file_url}


@router.get("/mikrotik")
def mikrotik() -> dict[str, Any]:
    active_connections = get_active_connections()
    all_user = get_all_users()

    active_connections_count = len(active_connections)
    total_now = active_connections_count * 500

    return {
        "active_connect_now": active_connections,
        "active_connections": active_connections_count,
        "price": total_now,
        "all_user": all_user,
    }
