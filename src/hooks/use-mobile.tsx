import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
    }
    mql.addEventListener("change", onChange)
    const initialMobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(initialMobile)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return false during SSR to prevent hydration mismatch
  return hasMounted ? isMobile : false
}
