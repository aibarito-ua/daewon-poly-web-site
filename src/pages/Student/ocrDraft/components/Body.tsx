import { TitleArea } from "./TitleArea";
import { ContentArea } from "./ContentArea";

interface IProps {
    title: string;
    content: string;
    onChangeTitle: (text: string) => void;
    onChangeContent: (text: string) => void;
}

export const Body = ({ title, content, onChangeTitle, onChangeContent }: IProps): JSX.Element => {
    return (
        <>
            <div className="ocr-1st-draft-line-gap" />
            <TitleArea title={title} onChangeText={onChangeTitle} />
            <div className="ocr-1st-draft-line-gap" />
            <ContentArea content={content} onChangeText={onChangeContent} />
        </>
    )
}