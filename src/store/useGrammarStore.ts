import {create} from 'zustand'
import { GrammarCF } from '../util/common/commonFunctions';

const useGrammarStore = create<IUseGrammarStore>((set, get)=>({
    
    // 추후 DB에 저장될 Preview data
    grammarAll: '',
    grammarTitle: '',
    grammarBody: '',
    setGrammarTitle: (title_text: any)=>{
        set(()=>({grammarTitle: title_text}))
    },
    setGrammarBody: (body:any) => {
        set(()=>({grammarBody: body}))
    },
    setGrammarAll: (data:any) =>{
        // 받은 data 첫번째 잘라내기
        const title = data.splice(0, 1);
        // 잘라낸 data의 나머지
        const body = data;

        const all = title.concat(body)
        set(()=>({
            grammarTitle:title,
            grammarBody:body,
            grammarAll: all
        }))
    },

    // 추후 DB에 저장될 Grammar result data
    resultTitle: [],
    resultBody: [],
    setGrammarResult: (data:any) => {
        // console.log('origin data =',data)
        const title = data.splice(0, 1);
        const body = data
        // console.log('title =',title)
        // console.log('body =',body)
        const compareDiffs = (data:any) => {
            let compareResults = [];
            for (const paragraghIdx in data) {
                let paragraghResult = [];
                const origin_array = data[paragraghIdx].origin_text_array;
                const change_array = data[paragraghIdx].change_text_array;
                for (const spliteSentenceIndex in origin_array) {
                    const origin = origin_array[spliteSentenceIndex];
                    const change = change_array[spliteSentenceIndex];
                    const compareResult = GrammarCF.compareText(origin, change);
                    paragraghResult.push(compareResult);
                }
                compareResults.push(paragraghResult);
            }
            return compareResults;
        };
        const titleCompare = compareDiffs(title);
        const bodyCompare = compareDiffs(body);

        set(()=>({
            resultTitle: titleCompare,
            resultBody: bodyCompare
        }))
        return {
            resultTitle: titleCompare,
            resultBody: bodyCompare
        }
    },
    setGrammarResultInit: ()=>{
        set(()=>({
            resultTitle: [],
            resultBody: []
        }))
    },

    // text data
    returnData: [
        {
            change_text_array: [
                "First day of 4th grade."
            ],
            origin_text_array: [
                "FIRSTS DAY OF 4TH GRADE"
            ]
        },
        {
            change_text_array: [
                "My hands were shaking as I walked out of my house last Monday.",
                "It wasn't just a regular Monday, but it was my first Monday at a new school."
            ],
            origin_text_array: [
                "My hand were shaking as I walk out of my house the last Monday.",
                "It wasn’t just a regurar Monday, but it was my first Monday at a new school."
            ]
        },
        {
            change_text_array: [
                "I had no friends, and I didn't even know who my teacher was.",
                "All I hoped for was for the day to go by quickly so I could return to my cozy bed."

            ],
            origin_text_array: [
                "I had no friend, and I didn’t even know who the my teacher was.",
                "All I was hope for was for the day to go by quick so I could return to my cozy bed."
            ]
        },
        {
            change_text_array: [
                "The school bus pulled up to the bus stop, and I took a deep breath as I stepped on the bus.",
                "The kids were yelling and playing, but they all stopped and stared at me.",
                "I slid into the first empty seat I could find.",
                "After the bus pulled up to school, all the kids went to their classrooms.",
                "I didn't know where to go.",
            ],
            origin_text_array: [
                "The school bus pulled up to the bus stop and I took a deep breathing as I stepped on the bus.",
                "The kids were yell and play, but they all stopped and stared at me.",
                "I slid into the first empty seat I could find.",
                "After the bus pulled up to school, all the kids want to their classroom.",
                "I didn’t know where to go.",
            ]
        },
        {
            change_text_array: [
                "The bus driver honked the horn and pointed to the school, but it was raining too hard for me to hear what he was saying.",
                "I stood in the rain and stared at the enormous building.",
                "Then I felt warm hands on my arm.",
                "It was a girl."
            ],
            origin_text_array: [
                "The bus driver honked the hon and pointed the school, but it was raining too hard for me to hear what he was saying.",
                "I stood in the rain and stared at the enomous building.",
                "Then I felt a warm hands on my arm.",
                "It was a girl."
            ]
        },
        {
            change_text_array: [
                "She said that her name was Sally.",
                "She was in the 4th grade, and it was her first day too!",
                "Since we are both feeling nervous, we decided to stick together and help each other.",
                "Sally and I walked into the school together, as brave as two 4th grade kids can be.",
            ],
            origin_text_array: [
                "She sai that her name was sally.",
                "She was in the 4th grade, and it was her first day, too!",
                "Since we are both feeling nervous, we decided to stick together and help each other.",
                "Sally and I walked into the school together as brave as two 4th grade kids can be."
            ]
        },
        {
            change_text_array: [
                "Although my first day was still scary, Sally made it easier.",
                "When I realized I had forgotten to bring a drink for lunch, Sally shared hers with me.",
                "When Sally couldn’t figure out a math problem, I showed her how to find the answer.",
                "I learned that if you are brave, you can turn a terrifying first day into a day of making new friends and experiencing new things."
            ],
            origin_text_array: [
                "Although my first day was still scared, Sally made it easier.",
                "When I realized I had forgot  to bring a drink for lunch, Sally shared hers with me.",
                "When Sally couldn’t figure a math problem, I showed her how to find the answer.",
                "I learned that if you are brave, you can turn a terrified first day into a day of making new friends and experiencing new things."
            ]
        }
    ]
}))
export default useGrammarStore
// FIRSTS DAY OF 4TH GRADE
// My hand were shaking as I walk out of my house the last Monday. It wasn’t just a regurar Monday, but it was my first Monday at a new school. 
// I had no friend, and I didn’t even know who the my teacher was. All I was hope for was for the day to go by quick so I could return to my cozy bed.

// The school bus pulled up to the bus stop and I took a deep breathing as I stepped on the bus. The kids were yell and play, but they all stopped and stared at me. I slid into the first empty seat I could find. After the bus pulled up to school, all the kids want to their classroom. I didn’t know where to go.
// The bus driver honked the hon and pointed the school, but it was raining too hard for me to hear what he was saying. I stood in the rain and stared at the enomous building. Then I felt a warm hands on my arm. It was a girl.
// She sai that her name was sally. She was in the 4th grade, and it was her first day, too! Since we are both feeling nervous, we decided to stick together and help each other. Sally and I walked into the school together as brave as two 4th grade kids can be.

// Although my first day was still scared, Sally made it easier. When I realized I had forgot  to bring a drink for lunch, Sally shared hers with me. When Sally couldn’t figure a math problem, I showed her how to find the answer. I learned that if you are brave, you can turn a terrified first day into a day of making new friends and experiencing new things. 


 