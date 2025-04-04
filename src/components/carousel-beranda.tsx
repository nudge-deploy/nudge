import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel"
import {useEffect, useState} from "react"
import SkeletonCard from "@/components/skeleton-card.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

interface Props {
    cards: CardCarousel[];
    onCardClick: (card: CardCarousel) => void;
}

export default function CarouselBeranda({cards, onCardClick}: Props) {
    const [api, setApi] = useState<any>()
    const [current, setCurrent] = useState(0)

    const product = cards[current];

    useEffect(() => {
        if (!api) {
            return
        }

        const handleSelect = () => {
            setCurrent(api.selectedScrollSnap())
        }

        api.on("select", handleSelect)
        api.on("reInit", handleSelect)

        return () => {
            api.off("select", handleSelect)
            api.off("reInit", handleSelect)
        }
    }, [api])

    if (!product) return (
        <SkeletonCard/>
    )

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="font-semibold">Promo</div>
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
                setApi={setApi}
            >
                <CarouselContent>
                    <>
                        {cards.map((item, index) => (
                            <CarouselItem key={index} className="basis-full">
                                <Card className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        {/*<CardTitle className="text-sm font-bold">Rekomendasi untuk Anda</CardTitle>*/}
                                        {/*<AlertCircle className="h-4 w-4" />*/}
                                    </CardHeader>
                                    <CardContent className="font-medium min-h-40 max-h-40">
                                        <p className="text-sm mb-3">
                                            {item.content}
                                        </p>
                                        <Button size="sm" className="w-full bg-[#ffb703] hover:bg-blue-100 text-[#023047] font-semibold" onClick={() => onCardClick(item)}>
                                            {item.label}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </>
                </CarouselContent>
            </Carousel>

            {/* Index indicators */}
            <div className="flex justify-center gap-2 mt-2">
                {cards.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${current === index ? "bg-[#003049]" : "bg-[#fcbf49]"}`}
                        onClick={() => api?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}