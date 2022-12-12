import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import Store from "../app/Store";
import { ROUTES } from "../constants/routes.js";
import BillsUI from "../views/BillsUI.js"

import store from "../__mocks__/store"




window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee"
  })
);

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ data: [], pathname });
};

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form displays correctly", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      screen.getByLabelText('Type de dépense')
      screen.getByLabelText('Nom de la dépense')
      screen.getByLabelText('Date')
      screen.getByLabelText('Montant TTC')
      screen.getByLabelText('TVA')
      screen.getByLabelText('%')
      screen.getByLabelText('Commentaire')
      screen.getByLabelText('Justificatif')


      //to-do write assertion
    })

    test("I can load the New Bill container", () => {
      new NewBill({ document, onNavigate: 'test', store: 'test', localStorage: 'test' })
    })
    test("handleChangeFile is called", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const newBill = new NewBill({
        document,
        onNavigate,
        store: Store,
        localStorage: window.localStorage
      });
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const file = screen.getByTestId("file");

      file.addEventListener("change", handleChangeFile);
      fireEvent.change(file, {
        target: {
          files: [new File(["image"], "helloooo.png", { type: "image/png" })]
        }
      });
      expect(handleChangeFile).toHaveBeenCalled();

    })

    test("Then function handleSubmit should be called", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        store: Store,
        localStorage: window.localStorage
      });

      const form = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBill.handleSubmit);
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();

    })
    test("Then should fails with 404 message error", async () => {
      const spy = jest.spyOn(store, "post")

      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("Then should fails with 500 message error", async () => {
      const spy = jest.spyOn(store, "post")
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });


  })
})