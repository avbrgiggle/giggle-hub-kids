
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
}

export function FAQ({ question, answer }: FAQProps) {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="text-left text-lg font-medium">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-gray-600">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
}
