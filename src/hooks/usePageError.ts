import { useCallback, useState } from "react";

/**
 * Generic error state management hook
 * @template TErrorKind - Union type of error kinds for a specific page
 */
export interface UsePageErrorReturn<TErrorKind extends string> {
    /** Map of error kinds to their error messages (null if no error) */
    errors: Map<TErrorKind, string | null>;
    /** Check if a specific error kind has an error */
    hasError: (kind: TErrorKind) => boolean;
    /** Check if any error exists */
    hasAnyError: () => boolean;
    /** Set an error for a specific kind */
    setError: (kind: TErrorKind, message?: string) => void;
    /** Clear an error for a specific kind */
    clearError: (kind: TErrorKind) => void;
    /** Clear all errors */
    clearAllErrors: () => void;
    /** Get error message for a specific kind */
    getErrorMessage: (kind: TErrorKind) => string | null;
}

export const usePageError = <TErrorKind extends string>(
    initialErrorKinds: TErrorKind[],
): UsePageErrorReturn<TErrorKind> => {
    const [errors, setErrors] = useState<Map<TErrorKind, string | null>>(() => {
        const map = new Map<TErrorKind, string | null>();
        for (const key of initialErrorKinds) {
            map.set(key, null);
        }
        return map;
    });

    const hasError = useCallback(
        (kind: TErrorKind): boolean => {
            return errors.get(kind) !== null;
        },
        [errors],
    );

    const hasAnyError = useCallback((): boolean => {
        for (const value of errors.values()) {
            if (value !== null) return true;
        }
        return false;
    }, [errors]);

    const setError = useCallback((kind: TErrorKind, message?: string): void => {
        setErrors((prev) => {
            const next = new Map(prev);
            next.set(kind, message ?? "An error occurred");
            return next;
        });
    }, []);

    const clearError = useCallback((kind: TErrorKind): void => {
        setErrors((prev) => {
            const next = new Map(prev);
            next.set(kind, null);
            return next;
        });
    }, []);

    const clearAllErrors = useCallback((): void => {
        setErrors((prev) => {
            const next = new Map(prev);
            for (const key of next.keys()) {
                next.set(key, null);
            }
            return next;
        });
    }, []);

    const getErrorMessage = useCallback(
        (kind: TErrorKind): string | null => {
            return errors.get(kind) ?? null;
        },
        [errors],
    );

    return {
        errors,
        hasError,
        hasAnyError,
        setError,
        clearError,
        clearAllErrors,
        getErrorMessage,
    };
};

/**
 * Type helper for creating page-specific error kinds
 * Usage: type CircuitEditorErrorKind = PageErrorKind<typeof CIRCUIT_EDITOR_ERROR_KINDS>;
 */
export type PageErrorKind<T extends readonly string[]> = T[number];
