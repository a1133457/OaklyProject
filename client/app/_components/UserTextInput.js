'use client'

export default function UserTextInput({
    id, label, type = 'text',
    value, onChange, required,
    hint, error,
}) {
    return (
        <div className="mb-4">
            <label className="form-label" htmlFor={id}>
                {label}{required && ' *'}
            </label>
            <input
                id={id}
                type={type}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={value}
                onChange={onChange}
                required={required}
            />
            {hint && !error && <div className="form-text">{hint}</div>}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    )
}
