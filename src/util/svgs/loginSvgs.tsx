import React from "react";

function IdIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg {...props} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.414" cy="6.311" r="2.811" stroke="#B4B4B4"/>
            <path d="M17.15 18.019v-3.415a3 3 0 0 0-3-3H6.677a3 3 0 0 0-3 3v3.415" stroke="#B4B4B4" strokeLinecap="round"/>
        </svg>
    )
}
function PwIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg {...props} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.045 9.02h1.948a.89.89 0 0 1 .893.892v6.446c0 2.245-3.47 2.752-6.251 2.752-2.78 0-6.251-.507-6.251-2.752V9.913c0-.493.4-.892.893-.892h8.768V5.353c0-1.651-1.364-3.21-3.41-3.21-2.046 0-3.41 1.558-3.41 3.21V9.02" stroke="#B4B4B4" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M11.497 14.358v1.151a.833.833 0 1 1-1.666 0v-1.151a1.25 1.25 0 1 1 1.666 0z" fill="#B4B4B4"/>
        </svg>
    )   
}
function EyeOffIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg {...props} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.857 14.952A7.084 7.084 0 0 1 10.68 16.4c-4.92 0-7.733-5.624-7.733-5.624a12.935 12.935 0 0 1 3.557-4.175m2.7-1.28c.483-.112.98-.169 1.476-.169 4.921 0 7.733 5.624 7.733 5.624a12.994 12.994 0 0 1-1.518 2.24m-4.725-.75c-.791.854-2.127.9-2.98.104a2.106 2.106 0 0 1-.103-2.981c.033-.037.07-.07.103-.103M2.948 3.043 18.414 18.51" stroke="#707070" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )   
}
function EyeOnIcon(props: React.SVGAttributes<SVGElement>) {
    return (
        <svg {...props} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.544 10.313S6.32 4.76 11.18 4.76c4.86 0 7.636 5.553 7.636 5.553s-2.777 5.554-7.636 5.554c-4.86 0-7.636-5.554-7.636-5.554z" stroke="#707070" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.263 10.313a2.08 2.08 0 0 1-2.083 2.082 2.08 2.08 0 0 1-2.082-2.082A2.08 2.08 0 0 1 11.18 8.23a2.08 2.08 0 0 1 2.083 2.083z" stroke="#707070" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )   
}

export const svgIcons = {
    Icons: {
        IdIcon,
        PwIcon,
        EyeOffIcon,
        EyeOnIcon
    }
}