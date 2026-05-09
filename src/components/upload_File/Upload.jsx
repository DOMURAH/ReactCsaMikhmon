import { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress'
import { useContext } from "react";
import { StatsContext } from "../../StatsContext";
import { useNavigate } from "react-router-dom";

const DB_NAME = "my_csv_db"
const DB_VERSION = 1

export default function Upload() {

  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const {setStats} = useContext(StatsContext)

  const context = useContext(StatsContext)
  console.log(context)


  const uploadFile = async () =>{

    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try{
      const res = await fetch("http://127.0.0.1:8000/upload",{
        method : "POST",
        credentials : "include",
        body : formData
      })
 

      const data = await res.json()
      console.log(data.file_url)

      setStats(data)

      localStorage.setItem("csv_url",data.file_url)

      setTimeout(() =>{
        navigate("/dashboard")
      },4000)

      }
    catch(err){
      console.error("Erreur lors de l'upload du fichier :", err)  
    }
    setLoading(false)

  }

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
      {/* Radial gradients background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Upload card */}
      <div className="relative bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-12 w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Importer vos tickets
          </h1>
          <p className="text-gray-400">Glissez-déposez votre fichier CSV ou cliquez pour parcourir</p>
        </div>

        {/* Drop zone */}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-2xl p-16 text-center hover:border-purple-500 transition-all duration-300 group-hover:bg-gray-900/70">

            {/* Upload icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                <svg className="relative w-20 h-20 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Déposer votre fichier ici</h3>
            <p className="text-gray-400 mb-4">ou</p>

            {/* Browse button */}
            <button className="relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])}/>
              <label className="cursor-pointer" htmlFor="file">Parcourir les fichier</label>
            </button>

            <p className="text-sm text-gray-500 mt-6">Formats acceptés: CSV (max. 10MB)</p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900/30 rounded-xl p-4 border border-blue-500/20 text-center">
            <div className="text-blue-400 text-2xl font-bold">CSV</div>
            <div className="text-gray-400 text-sm mt-1">Format</div>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-4 border border-purple-500/20 text-center">
            <div className="text-purple-400 text-2xl font-bold">10MB</div>
            <div className="text-gray-400 text-sm mt-1">Taille max</div>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-4 border border-green-500/20 text-center">
            <div className="text-green-400 text-2xl font-bold">Rapide</div>
            <div className="text-gray-400 text-sm mt-1">Traitement</div>
          </div>
        </div>
        <div>
          {file && (
            <>
              <div className="mt-6 p-4 bg-green-500/20 border flex justify-center border-green-500 rounded-lg text-green-400">
                Fichier sélectionné  : <span className="font-bold text-green-300/50 ">{file.name}</span>
              </div>
              <div className="mt-8 flex justify-center">
                <button className="bg-green-500 m-auto cursor-pointer hover:bg-green-500/50 
                transition-all text-white font-bold py-2 px-4 rounded" onClick={uploadFile}>
                  {loading ? (<CircularProgress size={24} sx={{color : "white"}}/>) : ('Traiter les données')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}