import { FormEvent, useState } from "react";
import { ChangeEvent } from "react";
import GenderService from "../../services/GenderService";
import ErrorHandler from "../../handler/ErrorHandler";
import GenderFieldErrors from "../../interfaces/GenderFieldErrors";
import SpinnerSmall from "../SpinnerSmall";

interface AddGenderFormProps {
  onGenderAdded: (message: string) => void;
}

export const AddGenderForm = ({ onGenderAdded }: AddGenderFormProps) => {
  const [state, setState] = useState({
    loadingStore: false,
    gender: "",
    errors: {} as GenderFieldErrors,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStoreGender = (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingStore: true,
    }));

    GenderService.storeGender(state)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            gender: "",
            errors: {} as GenderFieldErrors,
          }));

          onGenderAdded(res.data.message);
        } else {
          console.error(
            "Unexpeected Status Error During Storing gender",
            res.status
          );
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStore: false,
        }));
      });
  };

  return (
    <>
      <form onSubmit={handleStoreGender}>
        <div className="form-group">
          <div className="mb-3">
            <label htmlFor="gender">Gender</label>
            <input
              type="text"
              className={`form-control ${
                state.errors.gender ? "is-invalid" : ""
              }`}
              id="gender"
              name="gender"
              value={state.gender}
              onChange={handleInputChange}
            />
            {state.errors.gender && (
              <p className="text-danger">{state.errors.gender[0]}</p>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={state.loadingStore}
            >
              {state.loadingStore ? (
                <>
                  <SpinnerSmall /> Loading...
                </>
              ) : (
                "SAVE"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
