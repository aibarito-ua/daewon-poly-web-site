import React from 'react';
// scroll ref hook
function useMoveScroll () {
    const element = React.useRef<HTMLDivElement>(null);
    const onMoveToElement = () => {
        element.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    };
    return {element, onMoveToElement};
}

export default useMoveScroll;