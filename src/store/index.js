import { createStore } from "vuex";
import db from "../firebase/firebaseInit";

export default createStore({
    state: {
        invoiceModal: null,
        modalActive: null,
        invoiceData: [],
        invoicesLoaded: null,
        currentInvoiceArray: null,
        editInvoice: null,
    },
    mutations: {
        toggle_invoice(state) {
            state.invoiceModal = !state.invoiceModal;
        },
        toggle_modal(state) {
            state.modalActive = !state.modalActive;
        },
        set_invoice_data(state, payload) {
            state.invoiceData.push(payload);
        },
        invoices_loaded(state) {
            state.invoicesLoaded = true;
        },
        set_current_invoice(state, payload) {
            state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
                return invoice.invoiceId == payload;
            });
        },
        toggle_edit_invoice(state) {
            state.editInvoice = !state.editInvoice;
        },
        delete_invoice(state, payload) {
            state.invoiceData = state.invoiceData.filter(
                (invoice) => invoice.docId !== payload
            );
        },
        update_status_to_paid(state, payload) {
            state.invoiceData.forEach((invoice) => {
                if (invoice.docId === payload) {
                    invoice.invoicePaid = true;
                    invoice.invoicePending = false;
                }
            });
        },
        update_status_to_pending(state, payload) {
            state.invoiceData.forEach((invoice) => {
                if (invoice.docId === payload) {
                    invoice.invoicePaid = false;
                    invoice.invoicePending = true;
                    invoice.invoiceDraft = false;
                }
            });
        },
    },
    actions: {
        async get_invoices({ commit, state }) {
            const getData = db.collection("invoices");
            const results = await getData.get();
            results.forEach((doc) => {
                if (
                    !state.invoiceData.some(
                        (invoice) => invoice.docId === doc.id
                    )
                ) {
                    const data = {
                        docId: doc.id,
                        invoiceId: doc.data().invoiceId,
                        billerStreetAddress: doc.data().billerStreetAddress,
                        billerCity: doc.data().billerCity,
                        billerZipCode: doc.data().billerZipCode,
                        billerCountry: doc.data().billerCountry,
                        clientName: doc.data().clientName,
                        clientEmail: doc.data().clientEmail,
                        clientStreetAddress: doc.data().clientStreetAddress,
                        clientCity: doc.data().clientCity,
                        clientZipCode: doc.data().clientZipCode,
                        clientCountry: doc.data().clientCountry,
                        invoiceDateUnix: doc.data().invoiceDateUnix,
                        invoiceDate: doc.data().invoiceDate,
                        paymentTerms: doc.data().paymentTerms,
                        paymentDueDateUnix: doc.data().paymentDueDateUnix,
                        paymentDueDate: doc.data().paymentDueDate,
                        productDescription: doc.data().productDescription,
                        invoiceItemList: doc.data().invoiceItemList,
                        invoiceTotal: doc.data().invoiceTotal,
                        invoicePending: doc.data().invoicePending,
                        invoiceDraft: doc.data().invoiceDraft,
                        invoicePaid: doc.data().invoicePaid,
                    };
                    commit("set_invoice_data", data);
                }
            });
            commit("invoices_loaded");
        },
        async update_invoice({ commit, dispatch }, { docId, routeId }) {
            commit("delete_invoice", docId);
            await dispatch("get_invoices");
            commit("toggle_invoice");
            commit("toggle_edit_invoice");
            commit("set_current_invoice", routeId);
        },
        async delete_invoice({ commit }, docId) {
            const getInvoice = db.collection("invoices").doc(docId);
            await getInvoice.delete();
            commit("delete_invoice", docId);
        },
        async update_status_to_paid_action({ commit }, docId) {
            const getInvoice = db.collection("invoices").doc(docId);
            await getInvoice.update({
                invoicePaid: true,
                invoicePending: false,
            });
            commit("update_status_to_paid", docId);
        },
        async update_status_to_pending_action({ commit }, docId) {
            const getInvoice = db.collection("invoices").doc(docId);
            await getInvoice.update({
                invoicePaid: false,
                invoicePending: true,
                invoiceDraft: false,
            });
            commit("update_status_to_pending", docId);
        },
    },
    modules: {},
});
