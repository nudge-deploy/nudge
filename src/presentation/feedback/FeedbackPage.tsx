import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import useViewModel from "./FeedbackPageViewModel.ts";

export default function FeedbackPage() {
    const {
        questions,
        ratings,
        handleRatingChange,
        handleSubmit,
        isComplete
    } = useViewModel();

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Feedback Form</CardTitle>
                    <CardDescription>
                        Please rate each question on a scale from 1 to 5, where 1 is the lowest and 5 is the highest.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <>
                        {questions.map((q) => (
                            <div key={q.id} className="space-y-3">
                                <div>
                                    <h3 className="font-medium">{q.question}</h3>
                                    <p className="text-sm text-muted-foreground">{q.description}</p>
                                </div>
                                <RadioGroup
                                    value={ratings[q.id]}
                                    onValueChange={(value) => handleRatingChange(q.id, value)}
                                    className="flex space-x-2"
                                >
                                    <>
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <div key={value} className="flex flex-col items-center space-y-1">
                                                <RadioGroupItem value={value.toString()} id={`${q.id}-${value}`}
                                                                className="peer sr-only"/>
                                                <Label
                                                    htmlFor={`${q.id}-${value}`}
                                                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                                                >
                                                    {value}
                                                </Label>
                                                <span
                                                    className="text-xs">{value === 1 ? "Lowest" : value === 5 ? "Highest" : ""}</span>
                                            </div>
                                        ))}
                                    </>
                                </RadioGroup>
                            </div>
                        ))}
                    </>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={!isComplete} className="w-full">
                        Submit Feedback
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

