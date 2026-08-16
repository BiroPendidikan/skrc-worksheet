'use client'
import { useEffect, useState } from 'react'

export default function Test() {
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    fetch('9cfb3147-5c95-4128-afbf-4b2e4a206532')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}