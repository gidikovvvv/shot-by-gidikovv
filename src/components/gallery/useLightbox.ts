import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { Photo } from '@/data/photos'

/**
 * Lightbox state lives in the URL (?photo=<id>) so a photo can be shared or
 * bookmarked, and the browser/phone Back button closes the viewer.
 */
export function useLightbox(list: Photo[]) {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const id = params.get('photo')
  const index = useMemo(() => (id ? list.findIndex((p) => p.id === id) : -1), [id, list])

  const setPhoto = useCallback(
    (photoId: string | null, replace: boolean) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (photoId) next.set('photo', photoId)
          else next.delete('photo')
          return next
        },
        { replace, preventScrollReset: true, state: photoId ? { lightbox: true } : null },
      )
    },
    [setParams],
  )

  const open = useCallback((photoId: string) => setPhoto(photoId, false), [setPhoto])

  const close = useCallback(() => {
    // If we pushed the entry ourselves, go back so Back doesn't reopen it.
    if ((location.state as { lightbox?: boolean } | null)?.lightbox) navigate(-1)
    else setPhoto(null, true)
  }, [location.state, navigate, setPhoto])

  const go = useCallback(
    (i: number) => {
      const n = list.length
      if (!n) return
      setPhoto(list[((i % n) + n) % n].id, true)
    },
    [list, setPhoto],
  )

  return { index, isOpen: index >= 0, open, close, go }
}
