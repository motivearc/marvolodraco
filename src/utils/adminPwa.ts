declare global {
  interface Window {
    __MARVOLO_ADMIN_PWA__?: boolean
  }
}

/** True when the document was loaded from the dedicated admin.html shell. */
export function isAdminPwaShell() {
  return window.__MARVOLO_ADMIN_PWA__ === true
}
