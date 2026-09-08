import { useEffect, useRef, useState } from 'react'
import type { BNode } from '../types/blog.types'


type UnsplashSearchImageProps = {
    onUpdate: (fragment: Partial<BNode>) => void
}



type UnsplashImage = {
    id: string
    description: string
    user: {
        name: string
        username: string
    }
    urls: {
        regular: string
        small: string
    }
}

// Clé d'access Unsplash
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string
const IMAGES_PER_PAGE = 9


const UnsplashSearchImage = ({
    onUpdate
}: UnsplashSearchImageProps) => {
    const [query, setQuery] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [display, setDisplay] = useState(false)
    const [results, setResults] = useState<UnsplashImage[]>([])
    const [resultsLength, setResultsLength] = useState<number>(0)
    const [current, setCurrent] = useState<number>(0)
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

    const total = Math.ceil(resultsLength / IMAGES_PER_PAGE)


    const searchImages = async (query: string) => {
        setResults([])
        if (!query) {
            return
        }
        console.log("Requête lancée")
        console.log(query)
        setResultsLength(0)
        setLoading(true)
        setCurrent(0)
        setError("")

        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=27`,
                {
                    headers: {
                        Authorization: `Client-ID ${ACCESS_KEY}`
                    }
                }
            )

            const data = await response.json()

            if (data.results) {
                setResults(data.results)
                setResultsLength(data.results.length)
                console.log(data.results, data.results.length)
            }
        } catch (error) {
            console.error(error instanceof Error ? error.message : "Erreur")
            setError("Une erreur est survenue...")
        } finally {
            setLoading(false)
            setDisplay(true)
        }

    }
    useEffect(() => {

        if (!ACCESS_KEY) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError("Clé d'access manquante...")
            return
        }

        if (!query) {
            return
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            searchImages(query)
        }, 500)


        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }

    }, [query])


    return (
        <div className="w-full">
            <div className="w-full">
                <input
                    autoFocus
                    type="text"
                    className="w-full outline-0 border-b border-b-neutral-300 p-2 focus:border-b-neutral-500 transition-all duration-200"
                    placeholder="Type keywords to search Unsplash, and press Enter"
                    value={query}
                    onChange={(e) => setQuery(e.target.value.trim())}
                />
                {error && <span className="flex justify-center text-sm my-2 text-red-600">{error}</span>}
                {loading && <span className="flex justify-center text-sm my-2">Recherche en cours...</span>}

                {display &&
                    <div className='w-full my-2'>
                        <div className='w-full flex items-center justify-between px-2 text-sm'>
                            <button
                                className={`text-neutral-600 hover:text-neutral-900 ${current === 0 ? "opacity-0 transition-all duration-200" : ""}`}
                                disabled={current === 0}
                                onClick={() => {
                                    if (current > 0) {
                                        setCurrent(prev => prev - 1)
                                    }
                                }}
                            >
                                <span>previous</span>
                            </button>
                            <span>{`${resultsLength} results`}</span>
                            <button
                                className={`text-neutral-600 hover:text-neutral-900 ${current === total - 1 ? "opacity-0 transition-all duration-200" : ""}`}
                                disabled={current === total - 1}
                                onClick={() => {
                                    if (current < total - 1) {
                                        setCurrent(prev => prev + 1)
                                    }
                                }}
                            >
                                <span>Next</span>
                            </button>
                        </div>
                        <div className="w-full grid grid-cols-3 gap-1 mt-2 overflow-y-auto cursor-pointer">
                            {results.slice(current * IMAGES_PER_PAGE, (current + 1) * IMAGES_PER_PAGE).map(image => (
                                <button
                                    key={image.id}
                                    className="unsplash-img relative p-0 border-0 overflow-hidden"
                                    onClick={() => {
                                        onUpdate({
                                            image: {
                                                url: image.urls.regular,
                                                alt: image.description,
                                                label: `Photo by <a href=https://unsplash.com/@${image.user.username.toLowerCase()} target="_blank"> ${image.user.name} </a> on <a href=https://unsplash.com target="_blank"> Unsplash </a>`,
                                            }
                                        })
                                    }}
                                >
                                    <img
                                        src={image.urls.small}
                                        alt={image.description}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className='absolute bottom-1 left-2 capitalize text-white drop-shadow drop-shadow-black/50 opacity-0'>{image.user.name.toLowerCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default UnsplashSearchImage

