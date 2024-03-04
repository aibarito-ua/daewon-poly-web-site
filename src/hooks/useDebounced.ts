import { useCallback, useEffect } from "react";
function useDebounced<T>( callbackFn: () => void, delay: number, deps: T) {
    const callback = useCallback(callbackFn, [deps, callbackFn]);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            callback();
        }, delay);

        return () => {
            clearTimeout(timer);
        }
    }, [callback, delay])
};
export default useDebounced;