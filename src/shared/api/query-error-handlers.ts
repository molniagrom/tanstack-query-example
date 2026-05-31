import type {FieldValues, Path, UseFormSetError} from "react-hook-form";
import type {Mutation} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {
    isJsonApiErrorDocument,
    type JsonApiErrorDocument,
    parseJsonApiErrors,
} from "../util/json-api-error.ts";

export const queryErrorHandlerForRHFFactory = <T extends FieldValues>({
    setError,
}: {
    setError?: UseFormSetError<T>
}) => {
    return (error: unknown) => {
        if (!isJsonApiErrorDocument(error)) {
            return false
        }

        const {fieldErrors, globalErrors} = parseJsonApiErrors(error)

        for (const [field, message] of Object.entries(fieldErrors)) {
            setError?.(field as Path<T>, {type: "server", message})
        }

        if (globalErrors.length > 0) {
            setError?.("root.server" as Path<T>, {
                type: "server",
                message: globalErrors.join("\n"),
            })
        }

        return true
    }
}

export const mutationGlobalErrorHandler = (
    error: unknown,
    _variables: unknown,
    _context: unknown,
    mutation: Mutation<unknown, unknown, unknown, unknown>,
) => {
    const meta = mutation.meta as {globalErrorHandler?: "off"} | undefined

    if (meta?.globalErrorHandler === "off") {
        return
    }

    if (isJsonApiErrorDocument(error)) {
        const {globalErrors} = parseJsonApiErrors(error as JsonApiErrorDocument)

        if (globalErrors.length > 0) {
            toast.error(globalErrors.join("\n"))
        }

        return
    }

    if (error instanceof Error && error.message) {
        toast.error(error.message)
    }
}
