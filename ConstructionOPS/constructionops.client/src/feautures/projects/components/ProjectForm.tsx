import type{
    FormEvent
} from "react";

import { useState } from "react";

import type {
    CreateProjectRequest
} from "../Contracts/CreateProjectRequest";

interface ProjectFormProps {
    companyId: string;
    clientId: string;
    onSubmit: (
        request: CreateProjectRequest
    ) => Promise<void>;
    submitting?: boolean;
}

export default function ProjectForm({
    companyId,
    clientId,
    onSubmit,
    submitting = false
}: ProjectFormProps) {

    const [projectCode, setProjectCode] =
        useState("");

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [plannedEndDate, setPlannedEndDate] =
        useState("");

    const [contractValue, setContractValue] =
        useState("");

    const [currencyCode, setCurrencyCode] =
        useState("INR");

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError(null);

        if (!projectCode.trim()) {
            setError("Project code is required.");
            return;
        }

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        if (
            startDate &&
            plannedEndDate &&
            plannedEndDate < startDate
        ) {
            setError(
                "Planned end date cannot be before start date."
            );

            return;
        }

        try {

            await onSubmit({
                companyId,
                clientId,

                projectCode:
                    projectCode.trim(),

                name:
                    name.trim(),

                description:
                    description.trim() || undefined,

                startDate:
                    startDate || undefined,

                plannedEndDate:
                    plannedEndDate || undefined,

                contractValue:
                    Number(contractValue || 0),

                currencyCode
            });

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create project."
            );
        }
    }

    return (
        <form
            className="project-form"
            onSubmit={handleSubmit}
        >

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <div className="form-section">

                <h2>
                    Project Information
                </h2>

                <div className="form-grid">

                    <label>

                        <span>
                            Project Code *
                        </span>

                        <input
                            value={projectCode}
                            onChange={event =>
                                setProjectCode(
                                    event.target.value
                                )
                            }
                            placeholder="PRJ-001"
                        />

                    </label>

                    <label>

                        <span>
                            Project Name *
                        </span>

                        <input
                            value={name}
                            onChange={event =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Green Valley Residential"
                        />

                    </label>

                </div>

                <label>

                    <span>
                        Description
                    </span>

                    <textarea
                        value={description}
                        onChange={event =>
                            setDescription(
                                event.target.value
                            )
                        }
                        rows={4}
                        placeholder="Project description..."
                    />

                </label>

            </div>

            <div className="form-section">

                <h2>
                    Schedule
                </h2>

                <div className="form-grid">

                    <label>

                        <span>
                            Start Date
                        </span>

                        <input
                            type="date"
                            value={startDate}
                            onChange={event =>
                                setStartDate(
                                    event.target.value
                                )
                            }
                        />

                    </label>

                    <label>

                        <span>
                            Planned End Date
                        </span>

                        <input
                            type="date"
                            value={plannedEndDate}
                            onChange={event =>
                                setPlannedEndDate(
                                    event.target.value
                                )
                            }
                        />

                    </label>

                </div>

            </div>

            <div className="form-section">

                <h2>
                    Contract
                </h2>

                <div className="form-grid">

                    <label>

                        <span>
                            Contract Value
                        </span>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={contractValue}
                            onChange={event =>
                                setContractValue(
                                    event.target.value
                                )
                            }
                        />

                    </label>

                    <label>

                        <span>
                            Currency
                        </span>

                        <select
                            value={currencyCode}
                            onChange={event =>
                                setCurrencyCode(
                                    event.target.value
                                )
                            }
                        >
                            <option value="INR">
                                INR
                            </option>

                            <option value="USD">
                                USD
                            </option>

                            <option value="AED">
                                AED
                            </option>

                        </select>

                    </label>

                </div>

            </div>

            <div className="form-actions">

                <button
                    type="submit"
                    className="primary-button"
                    disabled={submitting}
                >
                    {submitting
                        ? "Creating..."
                        : "Create Project"}
                </button>

            </div>

        </form>
    );
}