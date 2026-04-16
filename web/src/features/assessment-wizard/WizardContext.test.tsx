import { useLayoutEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { WizardProvider, useWizard } from "./WizardContext";

function ProjectNameValue() {
  const { inputs } = useWizard();
  return <div data-testid="project-name">{inputs.projectName}</div>;
}

function AutoTypeProjectName({ value }: { value: string }) {
  const { setInputs } = useWizard();

  useLayoutEffect(() => {
    setInputs({ projectName: value });
  }, [setInputs, value]);

  return null;
}

describe("WizardProvider draft hydration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hydrates saved draft when there is no user input", async () => {
    localStorage.setItem(
      "buyVsBuild_draft",
      JSON.stringify({
        projectName: "Saved draft project",
      }),
    );

    render(
      <WizardProvider>
        <ProjectNameValue />
      </WizardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("project-name").textContent).toBe("Saved draft project");
    });
  });

  it("does not overwrite user input that occurs before hydration", async () => {
    localStorage.setItem(
      "buyVsBuild_draft",
      JSON.stringify({
        projectName: "Stale draft project",
      }),
    );

    render(
      <WizardProvider>
        <AutoTypeProjectName value="User typed project" />
        <ProjectNameValue />
      </WizardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("project-name").textContent).toBe("User typed project");
    });
  });
});
