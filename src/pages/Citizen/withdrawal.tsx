import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { withdrawRequest } from "../../api/auth";
import { toast } from "react-toastify";
import { WithdrawRequestData } from "../../Types/types";
import { useAuthContext } from "../../context/authContext";
 
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`;
 
const BANKS = [
  { id: 1, name: "Meezan" },
  { id: 2, name: "HBL" },
  { id: 3, name: "UBL" },
  { id: 4, name: "MCB" },
];
 
const PAYMENT_METHODS = [
  {
    id: "BANK" as const,
    label: "Bank Transfer",
    sublabel: "1–3 business days",
    icon: "account_balance",
    fast: false,
  },
  {
    id: "EASYPAISA" as const,
    label: "Easypaisa",
    sublabel: "Instant transfer",
    icon: "payments",
    fast: true,
  },
  {
    id: "JAZZCASH" as const,
    label: "JazzCash",
    sublabel: "Instant transfer",
    icon: "account_balance_wallet",
    fast: true,
  },
] as const;

const buildSchema = (availableBalance: number) =>
  yup.object({
    amount: yup
      .number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .min(500, "Minimum withdrawal is Rs 500")
      .max(availableBalance, `Cannot exceed Rs ${availableBalance}`),
    paymentMethod: yup.string().required("Select a payout method"),
    accountTitle: yup.string().required("Account holder name is required"),
    accountNumber: yup.string().required("This field is required"),
    bankName: yup.string().when("paymentMethod", {
      is: "BANK",
      then: (s) => s.required("Bank name is required"),
      otherwise: (s) => s.optional(),
    }),
    iban: yup.string().optional(),
    userId: yup.number().required("User ID is required"),
  });
const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[11px] font-semibold text-red-500 mt-1.5">
      <span className="material-symbols-outlined text-[13px]">error</span>
      {msg}
    </p>
  ) : null;
 

const FieldLabel = ({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) => (
  <label className="flex items-center justify-between mb-1.5">
    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
      {children}
    </span>
    {optional && (
      <span className="text-[11px] font-normal text-slate-400 normal-case tracking-normal">
        Optional
      </span>
    )}
  </label>
);
 
const inputCls =
  "w-full px-3.5 py-2.5 text-[13px] font-medium rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all duration-150 shadow-sm";

export default function WithdrawalModal({
  open,
  onClose,
  availableBalance,
}: {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
}) {
  const [query, setQuery] = useState("");
  const { user } = useAuthContext();
 
  const schema = buildSchema(availableBalance);
 
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<WithdrawRequestData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      amount: availableBalance,
      paymentMethod: "BANK",
      accountTitle: "",
      accountNumber: "",
      bankName: BANKS[1].name,
      iban: "",
      userId: user?.userId,
    },
    mode: "onChange",
  });
 
  useEffect(() => {
    if (user?.userId) {
      setValue("userId", user.userId, { shouldValidate: true });
      trigger("userId");
    }
  }, [user]);
 
  const paymentMethod = watch("paymentMethod");
  const amount        = watch("amount");
 
  useEffect(() => {
    setValue("accountNumber", "", { shouldValidate: false });
    if (paymentMethod === "EASYPAISA") {
      setValue("bankName", "EASYPAISA", { shouldValidate: true });
    } else if (paymentMethod === "JAZZCASH") {
      setValue("bankName", "JAZZCASH", { shouldValidate: true });
    } else {
      setValue("bankName", BANKS[1].name, { shouldValidate: true });
    }
  }, [paymentMethod, setValue]);
 
  const filteredBanks =
    query === ""
      ? BANKS
      : BANKS.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
 
  const onSubmit = async (data: WithdrawRequestData) => {
    try {
      const res = await withdrawRequest(data);
      if (res.success) {
        toast.success("Withdrawal request sent successfully");
        onClose();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };
 
  const accountMeta =
    paymentMethod === "BANK"
      ? { label: "Account Number", placeholder: "00112233445566" }
      : { label: "Mobile Number", placeholder: "+92 3XX XXXXXXX" };
 
  return (
    <>
      <style>{FONTS}</style>
 
      <Dialog
        open={open}
        onClose={onClose}
        className="relative z-50 focus:outline-none"
      >
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px] transition-opacity duration-300 ease-out data-closed:opacity-0" />
 
        <div className="fixed inset-0 z-10 overflow-y-auto font-['DM_Sans',sans-serif]">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 overflow-hidden"
            >
              <header className="px-7 pt-7 pb-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-emerald-600 text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        account_balance
                      </span>
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold text-slate-900 leading-tight">
                        Request Withdrawal
                      </h2>
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        Enter amount and payout details
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </header>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="px-7 py-6 overflow-y-auto max-h-[calc(90vh-220px)] space-y-6 bg-slate-50/50">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                        Available Balance
                      </p>
                      <p className="text-[32px] font-black text-slate-900 leading-none tracking-tight">
                        Rs {availableBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                      <span
                        className="material-symbols-outlined text-slate-400 text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        info
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                        Min. Rs 500
                      </span>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Amount (Rs)</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400 pointer-events-none">
                        Rs
                      </span>
                      <input
                        id="amount"
                        type="number"
                        className={`${inputCls} pl-9 text-[18px] font-bold`}
                        {...register("amount", { valueAsNumber: true })}
                      />
                    </div>
                    {errors.amount ? (
                      <ErrorMsg msg={errors.amount.message} />
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        Enter between Rs 500 and Rs {availableBalance.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <FieldLabel>Payout Method</FieldLabel>
                    <div className="grid grid-cols-3 gap-2.5">
                      {PAYMENT_METHODS.map((method) => {
                        const active = paymentMethod === method.id;
                        return (
                          <button
                            type="button"
                            key={method.id}
                            onClick={() =>
                              setValue("paymentMethod", method.id, { shouldValidate: true })
                            }
                            className={`relative flex flex-col items-start p-3.5 rounded-2xl border-2 text-left transition-all duration-150 focus:outline-none ${
                              active
                                ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            {active && (
                              <span
                                className="absolute top-2.5 right-2.5 material-symbols-outlined text-emerald-500 text-[14px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                            )}
                            <span
                              className={`material-symbols-outlined text-[22px] mb-2.5 ${
                                active ? "text-emerald-600" : "text-slate-400"
                              }`}
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              {method.icon}
                            </span>
                            <span
                              className={`text-[12px] font-bold leading-tight ${
                                active ? "text-slate-900" : "text-slate-600"
                              }`}
                            >
                              {method.label}
                            </span>
                            <span
                              className={`mt-1 text-[10px] font-semibold ${
                                method.fast
                                  ? active
                                    ? "text-emerald-600"
                                    : "text-emerald-500"
                                  : "text-slate-400"
                              }`}
                            >
                              {method.sublabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="material-symbols-outlined text-slate-400 text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {paymentMethod === "BANK"
                          ? "account_balance"
                          : paymentMethod === "EASYPAISA"
                          ? "payments"
                          : "account_balance_wallet"}
                      </span>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        {paymentMethod === "BANK"
                          ? "Bank Details"
                          : `${paymentMethod} Account`}
                      </h3>
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Account holder name */}
                      <div>
                        <FieldLabel>Account Holder Name</FieldLabel>
                        <input
                          type="text"
                          placeholder="Full name"
                          className={inputCls}
                          {...register("accountTitle")}
                        />
                        <ErrorMsg msg={errors.accountTitle?.message} />
                      </div>
 
                      {/* Bank name */}
                      <div>
                        <FieldLabel>Bank Name</FieldLabel>
                        {paymentMethod === "BANK" ? (
                          <Controller
                            name="bankName"
                            control={control}
                            render={({ field }) => (
                              <Combobox
                                value={
                                  BANKS.find((b) => b.name === field.value) ?? null
                                }
                                onChange={(bank) =>
                                  field.onChange(bank?.name ?? "")
                                }
                                onClose={() => setQuery("")}
                              >
                                <div className="relative">
                                  <ComboboxInput
                                    className={inputCls}
                                    displayValue={(
                                      bank: (typeof BANKS)[0] | null
                                    ) => bank?.name ?? ""}
                                    onChange={(e) => setQuery(e.target.value)}
                                  />
                                  <ComboboxButton className="absolute inset-y-0 right-0 px-3 flex items-center">
                                    <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                                  </ComboboxButton>
                                </div>
                                <ComboboxOptions
                                  anchor="bottom"
                                  transition
                                  className={clsx(
                                    "w-(--input-width) rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-[100] [--anchor-gap:--spacing(1)] empty:invisible",
                                    "transition duration-100 ease-in data-leave:data-closed:opacity-0"
                                  )}
                                >
                                  {filteredBanks.map((bank) => (
                                    <ComboboxOption
                                      key={bank.id}
                                      value={bank}
                                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] cursor-pointer data-focus:bg-emerald-50 hover:bg-emerald-50 select-none"
                                    >
                                      <CheckIcon className="invisible w-3.5 h-3.5 fill-emerald-600 group-data-selected:visible flex-shrink-0" />
                                      <span className="text-slate-800 font-medium">
                                        {bank.name}
                                      </span>
                                    </ComboboxOption>
                                  ))}
                                </ComboboxOptions>
                              </Combobox>
                            )}
                          />
                        ) : (
                          <input
                            type="text"
                            readOnly
                            value={paymentMethod}
                            className={`${inputCls} bg-slate-50 text-slate-400 cursor-not-allowed`}
                          />
                        )}
                        <ErrorMsg msg={errors.bankName?.message} />
                      </div>
 
                      <div
                        className={paymentMethod === "BANK" ? "sm:col-span-2" : ""}
                      >
                        <FieldLabel>{accountMeta.label}</FieldLabel>
                        <input
                          type="text"
                          placeholder={accountMeta.placeholder}
                          className={inputCls}
                          {...register("accountNumber")}
                        />
                        <ErrorMsg msg={errors.accountNumber?.message} />
                      </div>
                      {paymentMethod === "BANK" && (
                        <div className="sm:col-span-2">
                          <FieldLabel optional>IBAN</FieldLabel>
                          <input
                            type="text"
                            placeholder="PK00 ABCD 1234 5678 9012 34"
                            className={inputCls}
                            {...register("iban")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
 
                  <div className="bg-slate-900 rounded-2xl p-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 mb-3">
                      Summary
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-white/60">Withdrawal amount</span>
                        <span className="text-[13px] font-semibold text-white">
                          Rs {Number(amount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-white/60">Processing fee</span>
                        <span className="text-[13px] font-semibold text-emerald-400">
                          Free
                        </span>
                      </div>
                      <div className="h-px bg-white/10 my-1" />
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-bold text-white">You receive</span>
                        <span className="text-[20px] font-black text-emerald-400 tracking-tight">
                          Rs {Number(amount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <footer className="px-7 py-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-[13px] hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-[13px] shadow-md shadow-emerald-900/20 hover:bg-emerald-700 active:scale-95 transition-all duration-150 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    Request Withdrawal
                  </button>
                </footer>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}