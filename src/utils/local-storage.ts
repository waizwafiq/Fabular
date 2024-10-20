import React from "react";

export function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = React.useState<T>(() => {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null || storedValue === undefined) {
            return defaultValue;
        }

        try {
            return JSON.parse(storedValue) as T;
        } catch (error) {
            console.error(`Error parsing stored value for key "${key}":`, error);
            return defaultValue;
        }
    });

    React.useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage for key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}