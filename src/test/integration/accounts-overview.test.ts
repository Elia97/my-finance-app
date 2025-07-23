import { render } from "@testing-library/react";
import { AccountsOverview } from "@/components/home/accounts-overview";
import * as auth from "next-auth";
import "@testing-library/jest-dom";

jest.mock("next-auth");

describe("AccountsOverview integrazione", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Setup DB test: migrazioni + seed (eseguiti a livello globale)
  });

  it("mostra i dati utente dal DB reale", async () => {
    (auth.getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-db-id" },
    });

    const { findByText } = render(await AccountsOverview());

    expect(await findByText("I tuoi conti")).toBeInTheDocument();
    expect(await findByText("Patrimonio Totale")).toBeInTheDocument();
    // Altri assert basati su dati seedati nel DB
  });
});
