import React from 'react';

export const useEffectOnce = (effect: ()=>void | (()=>void)) => {
    const effectFn = React.useRef<()=>void | (()=>void)>(effect);
    const destroyFn = React.useRef<void| (()=>void)>();
    const effectCalled = React.useRef(false);
    const rendered = React.useRef(false);
    const [, setValue] = React.useState<number>(0);

    if (effectCalled.current) {
        rendered.current = true;
    }
    React.useEffect(()=>{
        // did mount at first time
        if (!effectCalled.current) {
            destroyFn.current=effectFn.current();
            effectCalled.current = true;
        }
        // forces one render after the effect is run
        setValue((val) => val+1);
        return ()=>{
            if (!rendered.current) {
                return;
            }
            if (destroyFn.current) {
                destroyFn.current();
            }
        }
    }, []);
}

export const useComponentWillMount = (func: () => void) => {
    const willMount = React.useRef(true);
    if (willMount.current) func()
    willMount.current = false;
}