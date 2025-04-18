import {useRef, useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"
import QuestionPage from "@/components/question-page"
import {CheckCircle2} from "lucide-react"
import CustomScrollbar from "@/components/custom-scrollbar"
import {useQuestionnaire} from "@/presentation/context/QuestionnaireContext.tsx";
import {useUser} from "@/presentation/context/UserContext.tsx";
import {useNavigate} from "react-router";

export default function Questionnaire() {
    const {
        onFinishSurvey
    } = useUser();
    const {
        loading,
        questions,
        responses,
        submitAnswer
    } = useQuestionnaire();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const DEFAULT_PATH = "/app/beranda";

    const QUESTIONS_PER_PAGE = 10
    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
    const progress = ((currentPage + 1) / totalPages) * 100
    const currIndex = QUESTIONS_PER_PAGE * currentPage;

    const startIndex = currentPage * QUESTIONS_PER_PAGE
    const endIndex = startIndex + QUESTIONS_PER_PAGE
    const currQuestions = questions.slice(startIndex, endIndex);
    const canProgress = (responses.length >= QUESTIONS_PER_PAGE * (currentPage + 1)) || (responses.length === questions.length);

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
            console.log(containerRef);
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1)
            window.scrollTo(0, 0)
            scrollToTop();
        } else {
            setIsComplete(true)
        }
    }

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleSubmit = () => {
        submitAnswer(onFinishSurvey);
        setIsComplete(true)
    }

    const handleContinue = () => {
        navigate(DEFAULT_PATH, {replace: true})
    }

    if(loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (isComplete) {
        return (
            <Card className="w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Thank You!</CardTitle>
                    <CardDescription className="text-center">Your responses have been submitted successfully.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <CheckCircle2 className="h-24 w-24 text-green-500 mb-4" />
                    <p className="text-center max-w-md">
                        We appreciate your time and input. Your responses will help us improve our services.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleContinue}>
                        Continue
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Questionnaire</CardTitle>
                <CardDescription>
                    Page {currentPage + 1} of {totalPages}
                </CardDescription>
                <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="relative flex">
                <div ref={containerRef} className="flex-1 h-[400px] overflow-auto pr-4 scrollbar-hide">
                    <div ref={contentRef}>
                        <QuestionPage questions={currQuestions} start={currIndex} />
                    </div>
                </div>
                <CustomScrollbar containerRef={containerRef} contentRef={contentRef} height={400} />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentPage === 0}>
                    Previous
                </Button>
                <Button
                    onClick={currentPage === totalPages - 1 ? handleSubmit : handleNext}
                    disabled={!canProgress}
                >
                    {currentPage === totalPages - 1 ? "Submit" : "Next"}
                </Button>
            </CardFooter>
        </Card>
    )
}

