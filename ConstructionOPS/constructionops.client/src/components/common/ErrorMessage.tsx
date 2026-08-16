interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorMessage({
    message,
    onRetry
}: ErrorMessageProps) {

    return (
        <div className="error-message">

            <h3>
                Something went wrong
            </h3>

            <p>
                {message}
            </p>

            {onRetry && (
                <button onClick={onRetry}>
                    Try Again
                </button>
            )}

        </div>
    );
}