import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills.js"
import store from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({ data: [], loading: false, error: true })
      document.body.innerHTML = html
      const activeIcon = screen.getByTestId('icon-window')
      expect(activeIcon).toBeTruthy()

    })
    test("Then error message is displayed", async () => {
      const html = BillsUI({ data: [], error: true })
      document.body.innerHTML = html
      const errorMessage = document.getElementById('error')
      expect(errorMessage.textContent.includes('Erreur')).toEqual(true)
    })
    test("Then loading message is displayed", async () => {
      const html = BillsUI({ data: [], loading: true })
      document.body.innerHTML = html
      const loading = document.getElementById('loading')
      expect(loading.textContent.includes('Loading...')).toEqual(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("I can load the Bills container", () => {
      new Bills({ document, onNavigate: 'test', store: 'test', localStorage: 'test' })
    })

    test("HandleClick is working", () => {

      const onNavigate = jest.fn()
      let billsTest = new Bills({ document, onNavigate, store: 'test', localStorage: 'test' })
      billsTest.handleClickNewBill()
      expect(onNavigate).toHaveBeenCalledTimes(1)
    })
    test("SortByDate have been called", () => {
      let billsTest = new Bills({ document, onNavigate: "test", store: 'test', localStorage: 'test' })
      const spy = jest.spyOn(bills, 'sort')
      const isSorted = billsTest.sortByDate(bills)

      expect(spy).toHaveBeenCalled()


    })
    test("handleClickIconEye have been called", () => {
      $.fn.modal = () => null
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = jest.fn()
      const bill = new Bills({ document, onNavigate, store: 'oui', localStorage: window.localStorage })
      const spy = jest.spyOn(bill, 'handleClickIconEye')
      const allIconsEye = screen.getAllByTestId(`icon-eye`)
      const firstIconEye = allIconsEye[0]
      expect(spy).toHaveBeenCalledTimes(0)
      expect(spy).not.toHaveBeenCalled()
      firstIconEye.click()
      expect(spy).toHaveBeenCalled()
    })
  })
})


describe("Given I am a user connected as Employee", () => {
  test("fetches bills from mock API GET", async () => {
    const getSpy = jest.spyOn(store, "get")
    const bills = await store.get()
    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(bills.data.length).toBe(4)
  })

  test("fetches bills from an API and fails with 404 message error", async () => {
    const spy = jest.spyOn(store, "get")
    store.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 404"))
    )

    const html = BillsUI({ error: "Erreur 404" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })

  test("fetches bills from an API and fails with 500 message error", async () => {
    const spy = jest.spyOn(store, "get")
    store.get.mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur 500"))
    )
    const html = BillsUI({ error: "Erreur 500" })
    document.body.innerHTML = html
    const message = await screen.getByText(/Erreur 500/)
    expect(message).toBeTruthy()
  })





})