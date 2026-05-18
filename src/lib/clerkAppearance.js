export const clerkAppearance = {
  options: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: '#a855f7',
    colorForeground: '#ffffff',
    colorMutedForeground: '#e2e8f0',
    colorInputForeground: '#f1f5f9',
    colorInput: 'rgba(100, 116, 139, 0.25)',
    colorBackground: 'transparent',
    colorNeutral: '#94a3b8',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'bg-transparent shadow-none border-0 p-0 w-full',
    headerTitle: '!text-white',
    headerSubtitle: '!text-white',
    formFieldLabel: '!text-white',
    formFieldLabelRow: '!text-white',
    formFieldHintText: '!text-slate-300',
    socialButtonsBlockButton:
      'border border-slate-500/40 bg-slate-500/20 !text-white hover:bg-slate-500/40',
    formButtonPrimary:
      'bg-gradient-to-r from-green-400/90 via-purple-500/90 to-blue-400/90 text-slate-900 font-bold',
    footerActionLink: 'text-green-400 hover:text-green-300',
    formFieldInput:
      'bg-slate-500/20 border-slate-400/30 !text-white placeholder:text-slate-400',
    dividerLine: 'bg-slate-500/40',
    dividerText: '!text-white',
    identityPreviewEditButton: '!text-green-400',
    footer: { display: 'none' },
  },
}
