import { useEffect } from "react";

export const useInfinite = (parentRef: Element | null, childRef: Element | null, callback: () => void) => {

  useEffect(() => {

    const options = {
      root: parentRef,
      rootMargin: '0px',
      threshold: 0
    }

    const observer = new IntersectionObserver(([target]) => {
      if (target.isIntersecting) {
        callback()
        if (childRef) {
          observer.unobserve(childRef)
        }
      }
    }, options)

    if (childRef) {
      observer.observe(childRef)
    }

    return () => {
      observer.disconnect()
    }
  }, [callback])
}
