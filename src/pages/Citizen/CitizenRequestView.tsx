import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import { submitPickupRequest } from "../../api/citizenService";
import { getSavedAddresses } from "../../api/auth";
import { SavedAddresses } from "../../Types/types";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

  :root {
    /* ── Brand greens (logo: #059669) ── */
    --sw-950: #022c22;
    --sw-900: #064e3b;
    --sw-800: #065f46;
    --sw-700: #047857;
    --sw-600: #059669;   /* ← exact logo green */
    --sw-500: #10b981;
    --sw-400: #34d399;
    --sw-300: #6ee7b7;
    --sw-200: #a7f3d0;
    --sw-100: #d1fae5;
    --sw-50:  #ecfdf5;

    /* ── Ink scale (logo: #111827) ── */
    --ink-900: #111827;  /* ← exact logo dark */
    --ink-800: #1f2937;
    --ink-700: #374151;
    --ink-600: #4b5563;
    --ink-500: #6b7280;
    --ink-400: #9ca3af;  /* ← exact logo muted */
    --ink-300: #d1d5db;
    --ink-200: #e5e7eb;
    --ink-100: #f3f4f6;
    --ink-50:  #f9fafb;

    /* ── Material accent colours ── */
    --pet-dark:  #0369a1;  --pet-mid:   #0ea5e9;
    --pet-light: #e0f2fe;  --pet-bd:    #7dd3fc;

    --ppr-dark:  #92400e;  --ppr-mid:   #d97706;
    --ppr-light: #fef3c7;  --ppr-bd:    #fcd34d;

    --crd-dark:  #7c2d12;  --crd-mid:   #ea580c;
    --crd-light: #fff7ed;  --crd-bd:    #fdba74;

    --mtl-dark:  #1e3a5f;  --mtl-mid:   #475569;
    --mtl-light: #f1f5f9;  --mtl-bd:    #94a3b8;

    --non-dark:  #991b1b;  --non-mid:   #dc2626;
    --non-light: #fef2f2;  --non-bd:    #fca5a5;

    /* ── Shadows ── */
    --sh0:       0 1px 2px  rgba(17,24,39,.05);
    --sh1:       0 2px 8px  rgba(17,24,39,.08), 0 1px 3px rgba(17,24,39,.04);
    --sh2:       0 4px 18px rgba(17,24,39,.10), 0 2px 6px rgba(17,24,39,.05);
    --sh3:       0 12px 40px rgba(17,24,39,.13), 0 4px 14px rgba(17,24,39,.07);
    --sh-green:  0 4px 16px rgba(5,150,105,.30);
    --sh-focus:  0 0 0 3px  rgba(5,150,105,.20);
    --sh-pet:    0 0 0 3px  rgba(14,165,233,.18);
    --sh-ppr:    0 0 0 3px  rgba(217,119,6,.18);
    --sh-crd:    0 0 0 3px  rgba(234,88,12,.18);
    --sh-mtl:    0 0 0 3px  rgba(71,85,105,.18);
    --sh-non:    0 0 0 3px  rgba(220,38,38,.18);

    /* ── Radii ── */
    --r4:  4px;   --r8:  8px;   --r10: 10px;
    --r12: 12px;  --r16: 16px;  --r20: 20px;  --r24: 24px;  --r99: 99px;
  }

  /* ── Reset ── */
  .sw *, .sw *::before, .sw *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sw button, .sw input, .sw textarea, .sw select { font-family: 'DM Sans', sans-serif; }

  /* ── Root ── */
  .sw {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink-900);
    background: var(--ink-50);
    min-height: 100vh;
  }

  /* ════════════════════════════════════════════
     PAGE HEADER
  ════════════════════════════════════════════ */
  .sw-header { margin-bottom: 30px; }

  .sw-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 4px 14px 4px 4px;
    background: var(--sw-50);
    border: 1px solid var(--sw-200);
    border-radius: var(--r99);
    margin-bottom: 16px;
  }
  .sw-eyebrow-dot {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--sw-600);
    display: flex; align-items: center; justify-content: center;
  }
  .sw-eyebrow-lbl {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    color: var(--sw-700);
  }

  .sw-title {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(24px, 3.2vw, 33px);
    font-weight: 800; line-height: 1.12;
    color: var(--ink-900); letter-spacing: -.025em;
    margin-bottom: 10px;
  }
  .sw-title-green { color: var(--sw-600); }

  .sw-subtitle {
    font-size: 14.5px; font-weight: 400;
    color: var(--ink-500); line-height: 1.65;
    max-width: 520px;
  }

  /* ════════════════════════════════════════════
     STEPPER
  ════════════════════════════════════════════ */
  .sw-stepper {
    display: flex; align-items: center;
    margin-bottom: 24px;
    background: #fff;
    border: 1px solid var(--ink-200);
    border-radius: var(--r16);
    padding: 10px 20px;
    box-shadow: var(--sh0);
    overflow-x: auto; gap: 0;
  }
  .sw-step-item  { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
  .sw-step-line  { flex: 1; height: 1.5px; margin: 0 6px; border-radius: 2px; transition: background .4s; background: var(--ink-200); }
  .sw-step-line.done { background: var(--sw-300); }
  .sw-step-circle {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 800;
    transition: all .3s;
  }
  .sw-step-circle.active { background: var(--sw-600); color: #fff; box-shadow: 0 0 0 4px var(--sw-100), 0 3px 10px rgba(5,150,105,.25); }
  .sw-step-circle.done   { background: var(--sw-500); color: #fff; }
  .sw-step-circle.idle   { background: var(--ink-100); color: var(--ink-400); }
  .sw-step-lbl { font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sw-step-lbl.active { color: var(--ink-900); }
  .sw-step-lbl.done   { color: var(--sw-600); }
  .sw-step-lbl.idle   { color: var(--ink-400); }

  /* ════════════════════════════════════════════
     MAIN CARD
  ════════════════════════════════════════════ */
  .sw-card {
    background: #fff;
    border-radius: var(--r24);
    border: 1px solid var(--ink-200);
    box-shadow: var(--sh2);
    overflow: hidden;
  }

  /* ── Section ── */
  .sw-section { padding: 28px 32px; border-bottom: 1px solid var(--ink-100); }
  .sw-section:last-child { border-bottom: none; }

  .sw-sec-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 24px; }
  .sw-sec-num {
    width: 32px; height: 32px; border-radius: var(--r8);
    background: var(--sw-600); color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
    box-shadow: 0 3px 10px rgba(5,150,105,.28);
  }
  .sw-sec-title {
    font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700;
    color: var(--ink-900); letter-spacing: -.015em; margin-bottom: 3px;
  }
  .sw-sec-desc { font-size: 13px; color: var(--ink-400); line-height: 1.55; }

  /* ════════════════════════════════════════════
     CATEGORY STRIPS
  ════════════════════════════════════════════ */
  .sw-cat-group  { margin-bottom: 22px; }
  .sw-cat-group:last-child { margin-bottom: 0; }

  .sw-cat-strip  {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
  }
  .sw-cat-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: var(--r99);
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase; flex-shrink: 0;
  }
  .sw-cat-pill.recycle {
    background: var(--sw-50); color: var(--sw-800); border: 1px solid var(--sw-200);
  }
  .sw-cat-pill.non {
    background: var(--non-light); color: var(--non-dark); border: 1px solid var(--non-bd);
  }
  .sw-cat-divider { flex: 1; height: 1px; background: var(--ink-200); }
  .sw-cat-note { font-size: 11.5px; font-weight: 500; color: var(--ink-400); white-space: nowrap; }

  /* ════════════════════════════════════════════
     RECYCLABLE MATERIAL CARDS  (4-col grid)
  ════════════════════════════════════════════ */
  .sw-mat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .sw-mat-card {
    position: relative; cursor: pointer;
    border-radius: var(--r16); padding: 20px 12px 16px;
    border: 1.5px solid var(--ink-200); background: #fff;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    transition: border-color .2s, box-shadow .2s, transform .18s;
    outline: none; user-select: none; overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  /* Per-card background tint layer */
  .sw-mat-card::before {
    content: ''; position: absolute; inset: 0;
    opacity: 0; transition: opacity .25s; pointer-events: none;
    border-radius: calc(var(--r16) - 1.5px);
  }
  .sw-mat-card.pet::before   { background: linear-gradient(160deg, #f0f9ff 0%, #dbeafe 100%); }
  .sw-mat-card.ppr::before   { background: linear-gradient(160deg, #fffbeb 0%, #fef3c7 100%); }
  .sw-mat-card.crd::before   { background: linear-gradient(160deg, #fff7ed 0%, #ffedd5 100%); }
  .sw-mat-card.mtl::before   { background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%); }

  .sw-mat-card:hover { transform: translateY(-4px); box-shadow: var(--sh2); }
  .sw-mat-card:hover::before { opacity: 1; }

  .sw-mat-card.selected.pet   { border-color: var(--pet-mid); box-shadow: var(--sh-pet), var(--sh2); transform: translateY(-4px); }
  .sw-mat-card.selected.ppr   { border-color: var(--ppr-mid); box-shadow: var(--sh-ppr), var(--sh2); transform: translateY(-4px); }
  .sw-mat-card.selected.crd   { border-color: var(--crd-mid); box-shadow: var(--sh-crd), var(--sh2); transform: translateY(-4px); }
  .sw-mat-card.selected.mtl   { border-color: var(--mtl-mid); box-shadow: var(--sh-mtl), var(--sh2); transform: translateY(-4px); }
  .sw-mat-card.selected::before { opacity: 1; }

  /* Tick badge top-right */
  .sw-mat-tick {
    position: absolute; top: 10px; right: 10px;
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: scale(.3);
    transition: opacity .2s, transform .28s cubic-bezier(.34,1.56,.64,1);
  }
  .sw-mat-card.selected .sw-mat-tick               { opacity: 1; transform: scale(1); }
  .sw-mat-card.selected.pet .sw-mat-tick           { background: var(--pet-dark); }
  .sw-mat-card.selected.ppr .sw-mat-tick           { background: var(--ppr-dark); }
  .sw-mat-card.selected.crd .sw-mat-tick           { background: var(--crd-dark); }
  .sw-mat-card.selected.mtl .sw-mat-tick           { background: var(--mtl-dark); }

  /* Illustration container */
  .sw-illus-box {
    width: 80px; height: 80px; border-radius: var(--r12);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px; position: relative; z-index: 1;
    transition: transform .22s ease;
    flex-shrink: 0;
  }
  .sw-mat-card:hover   .sw-illus-box,
  .sw-mat-card.selected .sw-illus-box { transform: scale(1.07); }

  .sw-illus-box.pet { background: linear-gradient(145deg, #bfdbfe, #93c5fd); border: 1.5px solid #60a5fa; }
  .sw-illus-box.ppr { background: linear-gradient(145deg, #fde68a, #fbbf24); border: 1.5px solid #f59e0b; }
  .sw-illus-box.crd { background: linear-gradient(145deg, #fed7aa, #fb923c); border: 1.5px solid #f97316; }
  .sw-illus-box.mtl { background: linear-gradient(145deg, #e2e8f0, #cbd5e1); border: 1.5px solid #94a3b8; }

  .sw-mat-name {
    font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 700;
    color: var(--ink-900); letter-spacing: -.01em;
    margin-bottom: 8px; position: relative; z-index: 1;
    padding: 0 22px; line-height: 1.25;
  }
  .sw-mat-earn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: var(--r99);
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: .03em;
    background: var(--sw-100); color: var(--sw-800); border: 1px solid var(--sw-200);
    position: relative; z-index: 1;
  }

  /* ════════════════════════════════════════════
     NON-RECYCLABLE — Wide horizontal card
  ════════════════════════════════════════════ */
  .sw-non-card {
    display: flex; align-items: center; gap: 22px;
    padding: 22px 24px;
    border: 1.5px solid var(--ink-200); border-radius: var(--r16);
    background: #fff; cursor: pointer; outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    position: relative; overflow: hidden;
    -webkit-tap-highlight-color: transparent;
  }
  .sw-non-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%);
    opacity: 0; transition: opacity .25s; pointer-events: none;
    border-radius: calc(var(--r16) - 1.5px);
  }
  .sw-non-card:hover { border-color: var(--non-mid); box-shadow: var(--sh-non), var(--sh1); }
  .sw-non-card:hover::before { opacity: 1; }
  .sw-non-card.selected {
    border-color: var(--non-mid); box-shadow: var(--sh-non), var(--sh2);
    background: #fff5f5;
  }
  .sw-non-card.selected::before { opacity: 1; }

  .sw-non-illus {
    width: 90px; height: 90px; border-radius: var(--r12); flex-shrink: 0;
    background: linear-gradient(145deg, #fecaca, #fca5a5);
    border: 1.5px solid var(--non-bd);
    display: flex; align-items: center; justify-content: center;
    position: relative; z-index: 1;
    transition: transform .2s;
  }
  .sw-non-card:hover .sw-non-illus,
  .sw-non-card.selected .sw-non-illus { transform: scale(1.05); }

  .sw-non-info { flex: 1; position: relative; z-index: 1; }
  .sw-non-name {
    font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700;
    color: var(--ink-900); letter-spacing: -.015em; margin-bottom: 6px;
  }
  .sw-non-desc {
    font-size: 13px; color: var(--ink-500); line-height: 1.6; margin-bottom: 10px;
  }
  .sw-non-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: var(--r99);
    background: var(--non-light); border: 1px solid var(--non-bd);
    font-size: 11px; font-weight: 700; color: var(--non-dark); letter-spacing: .03em;
  }

  .sw-non-check-col { flex-shrink: 0; position: relative; z-index: 1; }
  .sw-non-check {
    width: 26px; height: 26px; border-radius: 50%; background: var(--non-mid);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: scale(.3);
    transition: opacity .2s, transform .28s cubic-bezier(.34,1.56,.64,1);
  }
  .sw-non-card.selected .sw-non-check { opacity: 1; transform: scale(1); }

  /* ════════════════════════════════════════════
     FORM INPUTS
  ════════════════════════════════════════════ */
  .sw-field { display: flex; flex-direction: column; gap: 7px; }
  .sw-label { font-size: 13px; font-weight: 600; color: var(--ink-700); }
  .sw-label .req { color: var(--sw-600); margin-left: 2px; }
  .sw-label .opt { font-weight: 400; color: var(--ink-400); margin-left: 4px; }

  .sw-input {
    width: 100%; padding: 12px 16px;
    border-radius: var(--r12);
    border: 1.5px solid var(--ink-200);
    background: var(--ink-50);
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink-900);
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    -webkit-appearance: none;
  }
  .sw-input::placeholder { color: var(--ink-300); }
  .sw-input:focus { border-color: var(--sw-500); background: #fff; box-shadow: var(--sh-focus); }
  .sw-input.err  { border-color: var(--non-mid); background: var(--non-light); }

  .sw-input-wrap { position: relative; }
  .sw-suffix {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 12px; font-weight: 700; color: var(--ink-500);
    background: var(--ink-200); padding: 2px 8px; border-radius: var(--r4);
    pointer-events: none;
  }
  .sw-hint { font-size: 12px; color: var(--ink-400); font-style: italic; }
  .sw-err-msg {
    font-size: 12px; color: var(--non-mid); font-weight: 500;
    display: flex; align-items: center; gap: 5px;
  }

  /* Upload */
  .sw-upload {
    border: 1.5px dashed var(--ink-300); border-radius: var(--r16);
    padding: 26px 16px; min-height: 118px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; background: var(--ink-50);
    text-align: center; gap: 6px;
    transition: border-color .2s, background .2s;
  }
  .sw-upload:hover  { border-color: var(--sw-600); background: var(--sw-50); }
  .sw-upload.filled { border-color: var(--sw-600); background: var(--sw-50); border-style: solid; }
  .sw-upload.err    { border-color: var(--non-mid); background: var(--non-light); }
  .sw-upload-icon {
    width: 44px; height: 44px; border-radius: var(--r12);
    background: #fff; border: 1px solid var(--ink-200);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 2px; box-shadow: var(--sh0);
  }

  /* Address */
  .sw-addr-box { border: 1.5px solid var(--ink-200); border-radius: var(--r16); overflow: hidden; }
  .sw-addr-head {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 18px;
    background: var(--sw-50); border-bottom: 1px solid var(--sw-200);
  }
  .sw-addr-icon {
    width: 32px; height: 32px; border-radius: var(--r8); flex-shrink: 0;
    background: var(--sw-600);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(5,150,105,.25);
  }
  .sw-addr-title { font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 700; color: var(--ink-900); }
  .sw-addr-sub   { font-size: 12px; color: var(--ink-500); margin-top: 2px; }
  .sw-addr-body  { padding: 16px 18px; background: #fff; }

  /* Combo listbox */
  .sw-combo {
    display: flex; border: 1.5px solid var(--ink-200); border-radius: var(--r12);
    overflow: hidden; background: var(--ink-50); transition: border-color .2s, box-shadow .2s;
  }
  .sw-combo:focus-within { border-color: var(--sw-500); box-shadow: var(--sh-focus); background: #fff; }
  .sw-combo.err  { border-color: var(--non-mid); }
  .sw-combo-in {
    flex: 1; padding: 12px 14px; border: none; background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: var(--ink-900);
    outline: none; min-width: 0;
  }
  .sw-combo-in::placeholder { color: var(--ink-300); }
  .sw-saved-btn {
    display: flex; align-items: center; gap: 5px; padding: 0 14px;
    border: none; border-left: 1px solid var(--ink-200);
    background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    color: var(--ink-500); white-space: nowrap; transition: background .15s, color .15s;
  }
  .sw-saved-btn:hover { background: var(--sw-50); color: var(--sw-700); }

  .sw-dropdown {
    min-width: var(--button-width); background: #fff;
    border: 1.5px solid var(--ink-200); border-radius: var(--r12);
    box-shadow: var(--sh3); overflow: hidden;
    font-family: 'DM Sans', sans-serif; z-index: 99;
  }
  .sw-dropdown-hdr {
    padding: 9px 14px; font-size: 10px; font-weight: 700;
    letter-spacing: .09em; text-transform: uppercase;
    color: var(--ink-400); background: var(--ink-50);
    border-bottom: 1px solid var(--ink-100);
  }
  .sw-dropdown-row {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; cursor: pointer;
    font-size: 13.5px; color: var(--ink-700); transition: background .12s;
  }
  .sw-dropdown-row:hover { background: var(--sw-50); color: var(--ink-900); }

  /* Two-col layout */
  .sw-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  /* ════════════════════════════════════════════
     FOOTER ACTIONS
  ════════════════════════════════════════════ */
  .sw-footer {
    padding: 22px 32px; background: var(--ink-50);
    border-top: 1px solid var(--ink-100);
    display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
  }
  .sw-btn-submit {
    flex: 1; min-width: 190px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 28px; border-radius: var(--r12);
    background: var(--sw-600); color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700;
    border: none; cursor: pointer; letter-spacing: -.01em;
    transition: background .2s, box-shadow .2s, transform .15s;
    box-shadow: var(--sh-green);
  }
  .sw-btn-submit:hover:not(:disabled) {
    background: var(--sw-700);
    box-shadow: 0 8px 24px rgba(5,150,105,.38);
    transform: translateY(-1px);
  }
  .sw-btn-submit:active:not(:disabled) { transform: translateY(0); }
  .sw-btn-submit:disabled { opacity: .45; cursor: not-allowed; }

  .sw-btn-ghost {
    padding: 14px 24px; border-radius: var(--r12);
    background: #fff; color: var(--ink-500);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    border: 1.5px solid var(--ink-200); cursor: pointer; transition: all .15s;
  }
  .sw-btn-ghost:hover { background: var(--ink-100); color: var(--ink-900); border-color: var(--ink-300); }

  /* Spinner */
  @keyframes sw-spin { to { transform: rotate(360deg); } }
  .sw-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: sw-spin .65s linear infinite;
  }

  /* Info banner */
  .sw-banner {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 18px 22px; background: #fff;
    border: 1px solid var(--sw-200); border-left: 4px solid var(--sw-600);
    border-radius: var(--r16); margin-top: 20px; box-shadow: var(--sh0);
  }
  .sw-banner-icon {
    width: 36px; height: 36px; border-radius: var(--r8); flex-shrink: 0;
    background: var(--sw-50); border: 1px solid var(--sw-200);
    display: flex; align-items: center; justify-content: center;
  }

  /* Animations */
  @keyframes sw-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .sw-a  { animation: sw-up .45s ease both; }
  .sw-a1 { animation-delay: .07s; }
  .sw-a2 { animation-delay: .14s; }
  .sw-a3 { animation-delay: .21s; }

  /* Responsive */
  @media (max-width: 640px) {
    .sw-mat-grid  { grid-template-columns: repeat(2, 1fr); }
    .sw-2col      { grid-template-columns: 1fr; }
    .sw-section, .sw-footer { padding: 20px 18px; }
    .sw-stepper   { display: none; }
    .sw-non-card  { flex-direction: column; text-align: center; }
    .sw-non-illus { width: 72px; height: 72px; }
    .sw-non-check-col { display: none; }
  }
`;


const FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const schema = yup.object({
  wasteType: yup
    .string()
    .oneOf(["PET", "CARDBOARD", "PAPER", "METAL", "NON_RECYCLABLE"])
    .required("Please select a waste material"),
  estimatedWeight: yup
    .number()
    .typeError("Please enter a valid number")
    .required("Estimated weight is required")
    .positive("Must be a positive number"),
  pickupAddress: yup.string().required("Pickup address is required"),
  notes: yup.string().optional(),
  photo: yup
    .mixed<FileList>().nullable().optional()
    .test("fileSize", "Max file size is 5 MB", (v) =>
      !v || v.length === 0 ? true : (v as FileList)[0].size <= FILE_SIZE)
    .test("fileFormat", "Only JPG, PNG or GIF allowed", (v) =>
      !v || v.length === 0 ? true : SUPPORTED_FORMATS.includes((v as FileList)[0].type)),
  latitude:  yup.number().required(),
  longitude: yup.number().required(),
});

type FormData  = yup.InferType<typeof schema>;
type WasteType = "PET" | "CARDBOARD" | "PAPER" | "METAL" | "NON_RECYCLABLE";
type LatLng    = [number, number];

/* ═══════════════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
   Every illustration is 64 × 64 viewBox, highly detailed, crystal-clear
═══════════════════════════════════════════════════════════════════ */

/** PET Plastic Bottle — translucent blue water bottle, clear label */
const SvgPET = () => (
  <svg width="58" height="58" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cap */}
    <rect x="24" y="4" width="16" height="9" rx="4" fill="#0369a1"/>
    <rect x="25" y="4" width="14" height="4" rx="2" fill="#0284c7"/>
    {/* Grip ridges on cap */}
    <rect x="26" y="9" width="2" height="3" rx="1" fill="#0369a1" opacity=".6"/>
    <rect x="30" y="9" width="2" height="3" rx="1" fill="#0369a1" opacity=".6"/>
    <rect x="34" y="9" width="2" height="3" rx="1" fill="#0369a1" opacity=".6"/>
    {/* Neck */}
    <rect x="26" y="13" width="12" height="8" rx="3" fill="#7dd3fc"/>
    {/* Shoulder curve — widens from neck to body */}
    <path d="M26 21 C20 22 18 25 18 29 L18 53 C18 56.3 20.7 59 24 59 L40 59 C43.3 59 46 56.3 46 53 L46 29 C46 25 44 22 38 21 Z"
      fill="#bae6fd"/>
    {/* Left specular / highlight strip */}
    <rect x="20" y="29" width="5" height="22" rx="2.5" fill="white" opacity=".55"/>
    {/* Right shadow strip */}
    <rect x="41" y="29" width="3" height="22" rx="1.5" fill="#7dd3fc" opacity=".5"/>
    {/* Top shoulder crease */}
    <path d="M18 29 Q32 32 46 29" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
    {/* Bottom body crease */}
    <path d="M18 50 Q32 53 46 50" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
    {/* Label band */}
    <rect x="18" y="32" width="28" height="15" rx="2" fill="#0ea5e9" opacity=".2"/>
    {/* Label border lines */}
    <line x1="18" y1="32" x2="46" y2="32" stroke="#7dd3fc" strokeWidth="1"/>
    <line x1="18" y1="47" x2="46" y2="47" stroke="#7dd3fc" strokeWidth="1"/>
    {/* Label text */}
    <text x="32" y="43" textAnchor="middle" fontSize="8"
      fill="#0369a1" fontWeight="800" fontFamily="'Outfit', sans-serif" letterSpacing=".06em">PET</text>
    {/* Recycling triangle on label */}
    <text x="32" y="36.5" textAnchor="middle" fontSize="5" fill="#0284c7" opacity=".7">♻</text>
    {/* Bottom dome */}
    <ellipse cx="32" cy="59" rx="14" ry="3.5" fill="#7dd3fc" opacity=".5"/>
    {/* Water fill illusion */}
    <path d="M19 46 Q32 48 45 46 L46 53 C46 56.3 43.3 59 40 59 L24 59 C20.7 59 18 56.3 18 53 Z"
      fill="#bae6fd" opacity=".45"/>
  </svg>
);

/** Paper — crisp A4 sheet with fold, ruled lines, corner dog-ear */
const SvgPaper = () => (
  <svg width="58" height="58" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow sheet — rotated */}
    <rect x="14" y="12" width="32" height="40" rx="3" fill="#fde68a" opacity=".6"
      transform="rotate(5 14 12)"/>
    {/* Second sheet */}
    <rect x="12" y="10" width="32" height="40" rx="3" fill="#fef9c3"
      transform="rotate(-2 12 10)"/>
    {/* Main foreground sheet */}
    <rect x="10" y="8" width="34" height="46" rx="3" fill="#fffbeb"/>
    {/* Dog-ear fold */}
    <path d="M32 8 L44 8 L44 20 Z" fill="#fcd34d"/>
    <path d="M32 8 L32 20 L44 20 Z" fill="#fef9c3"/>
    <line x1="32" y1="8" x2="44" y2="20" stroke="#fde68a" strokeWidth="1.2"/>
    {/* Margin line */}
    <line x1="17" y1="8" x2="17" y2="54" stroke="#fcd34d" strokeWidth="1" opacity=".5"/>
    {/* Ruled lines */}
    <rect x="20" y="24" width="16" height="2.5" rx="1.25" fill="#fcd34d"/>
    <rect x="20" y="30" width="20" height="2.5" rx="1.25" fill="#fcd34d"/>
    <rect x="20" y="36" width="14" height="2.5" rx="1.25" fill="#fcd34d"/>
    <rect x="20" y="42" width="18" height="2.5" rx="1.25" fill="#fcd34d"/>
    <rect x="20" y="48" width="10" height="2.5" rx="1.25" fill="#fcd34d"/>
    {/* Header block */}
    <rect x="20" y="16" width="8" height="5" rx="2" fill="#fbbf24" opacity=".6"/>
    {/* Drop shadow */}
    <ellipse cx="27" cy="56" rx="15" ry="2.5" fill="#fcd34d" opacity=".2"/>
  </svg>
);

/** Cardboard Box — open box seen from 3/4 angle, corrugated texture visible */
const SvgCardboard = () => (
  <svg width="58" height="58" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ground shadow */}
    <ellipse cx="32" cy="61" rx="20" ry="3" fill="#fdba74" opacity=".25"/>
    {/* ── Box body front face ── */}
    <rect x="10" y="28" width="34" height="28" rx="2" fill="#fdba74"/>
    {/* ── Box body right side face (3D depth) ── */}
    <path d="M44 28 L56 21 L56 49 L44 56 Z" fill="#fb923c" opacity=".75"/>
    {/* ── Box body bottom strip ── */}
    <path d="M10 56 L44 56 L56 49 L22 49 Z" fill="#ea580c" opacity=".2"/>
    {/* ── Front corrugation lines ── */}
    <line x1="18" y1="30" x2="18" y2="54" stroke="#fb923c" strokeWidth="1" opacity=".45"/>
    <line x1="24" y1="30" x2="24" y2="54" stroke="#fb923c" strokeWidth="1" opacity=".45"/>
    <line x1="30" y1="30" x2="30" y2="54" stroke="#fb923c" strokeWidth="1" opacity=".45"/>
    <line x1="36" y1="30" x2="36" y2="54" stroke="#fb923c" strokeWidth="1" opacity=".45"/>
    {/* ── Left open flap ── */}
    <path d="M10 28 L10 16 L22 19 L22 28 Z" fill="#fed7aa"/>
    <line x1="10" y1="28" x2="22" y2="28" stroke="#fdba74" strokeWidth="1"/>
    {/* ── Right open flap ── */}
    <path d="M44 28 L44 18 L34 15 L34 28 Z" fill="#fed7aa"/>
    <line x1="34" y1="28" x2="44" y2="28" stroke="#fdba74" strokeWidth="1"/>
    {/* ── Inside of box (dark) ── */}
    <path d="M10 28 L22 28 L34 28 L44 28 L44 29 L34 29 L22 29 L10 29 Z" fill="#c2410c" opacity=".12"/>
    {/* ── Tape strip front ── */}
    <rect x="25" y="28" width="8" height="12" rx="2" fill="#92400e" opacity=".18"/>
    {/* ── Tape strip top joining flaps ── */}
    <path d="M22 19 L34 15" stroke="#92400e" strokeWidth="3" strokeLinecap="round" opacity=".35"/>
    {/* Label */}
    <text x="27" y="46" textAnchor="middle" fontSize="7"
      fill="#7c2d12" fontWeight="800" fontFamily="'Outfit', sans-serif" opacity=".7">BOX</text>
    {/* Arrows on label */}
    <text x="27" y="52" textAnchor="middle" fontSize="5" fill="#92400e" opacity=".5">↑ THIS SIDE UP</text>
  </svg>
);

/** Metal Can — aluminium beverage can, realistic chrome + pull tab */
const SvgMetal = () => (
  <svg width="58" height="58" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ground shadow */}
    <ellipse cx="32" cy="61" rx="14" ry="2.5" fill="#94a3b8" opacity=".25"/>
    {/* ── Can body ── */}
    <rect x="18" y="14" width="28" height="40" rx="2" fill="#cbd5e1"/>
    {/* ── Left chrome highlight ── */}
    <rect x="18" y="14" width="8" height="40" rx="2" fill="#e2e8f0"/>
    {/* ── Right shadow zone ── */}
    <rect x="38" y="14" width="8" height="40" rx="2" fill="#94a3b8"/>
    {/* ── Top ellipse ── */}
    <ellipse cx="32" cy="14" rx="14" ry="4.5" fill="#94a3b8"/>
    <ellipse cx="32" cy="14" rx="9"  ry="2.8" fill="#64748b"/>
    {/* ── Bottom ellipse ── */}
    <ellipse cx="32" cy="54" rx="14" ry="4.5" fill="#94a3b8"/>
    <ellipse cx="32" cy="54" rx="9"  ry="2.8" fill="#64748b"/>
    {/* ── Top rim bead ── */}
    <rect x="18" y="17" width="28" height="3"  rx="1.5" fill="#94a3b8" opacity=".7"/>
    {/* ── Bottom rim bead ── */}
    <rect x="18" y="44" width="28" height="3"  rx="1.5" fill="#94a3b8" opacity=".7"/>
    {/* ── Pull-tab base disc ── */}
    <ellipse cx="32" cy="14" rx="5.5" ry="1.8" fill="#475569"/>
    {/* ── Pull-tab ring ── */}
    <path d="M32 14 L32 7 Q32 5 34.5 5 Q37 5 37 7.5 L37 10 Q37 12.5 34.5 12.5 L32 12.5"
      stroke="#475569" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    {/* ── Shine strip ── */}
    <rect x="42" y="18" width="2.5" height="24" rx="1.25" fill="white" opacity=".55"/>
    <rect x="38" y="18" width="1.5" height="24" rx=".75"  fill="white" opacity=".25"/>
    {/* ── Label band ── */}
    <rect x="18" y="22" width="28" height="20" fill="#64748b" opacity=".15"/>
    {/* ── Label text ── */}
    <text x="32" y="35" textAnchor="middle" fontSize="8"
      fill="#1e3a5f" fontWeight="800" fontFamily="'Outfit', sans-serif" letterSpacing=".06em">METAL</text>
    {/* ── Label lines ── */}
    <rect x="21" y="38" width="22" height="1.5" rx=".75" fill="#64748b" opacity=".3"/>
  </svg>
);

/** Non-Recyclable Trash Bag — black bag, tied knot, bold ✕ circle */
const SvgTrash = () => (
  <svg width="64" height="64" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ground shadow */}
    <ellipse cx="36" cy="68" rx="18" ry="3.5" fill="#fca5a5" opacity=".3"/>
    {/* ── Bag body ── */}
    <path d="M18 28 C15 33 14 38 14 46 C14 57 22 65 36 65 C50 65 58 57 58 46 C58 38 57 33 54 28 Z"
      fill="#fecaca"/>
    {/* ── Bag body sheen ── */}
    <path d="M18 28 C15 33 14 38 14 46 C14 50 15 54 18 57 C16 52 16 44 16 39 C16 34 17 30 19 28 Z"
      fill="white" opacity=".25"/>
    {/* ── Gathering ruffles at top ── */}
    <path d="M20 28 Q25 24 29 26 Q32 28 36 26 Q40 24 44 26 Q48 28 52 28"
      stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* ── Twist neck ── */}
    <path d="M28 26 Q32 22 36 24 Q40 22 44 26"
      stroke="#ef4444" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    {/* ── Tie knot ── */}
    <ellipse cx="36" cy="19" rx="7" ry="5" fill="#ef4444"/>
    <ellipse cx="36" cy="19" rx="4" ry="2.8" fill="#dc2626"/>
    {/* ── Knot ears ── */}
    <ellipse cx="28.5" cy="16" rx="3.5" ry="5" fill="#ef4444" transform="rotate(-15 28.5 16)"/>
    <ellipse cx="43.5" cy="16" rx="3.5" ry="5" fill="#ef4444" transform="rotate(15 43.5 16)"/>
    {/* ── Bag crease lines ── */}
    <path d="M20 32 C19 38 19 46 20 52" stroke="#fca5a5" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".7"/>
    <path d="M52 32 C53 38 53 46 52 52" stroke="#fca5a5" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".7"/>
    {/* ── White circle background for icon ── */}
    <circle cx="36" cy="46" r="13" fill="white" opacity=".92"/>
    {/* ── Red prohibition circle ── */}
    <circle cx="36" cy="46" r="13" stroke="#ef4444" strokeWidth="2.8" fill="none"/>
    {/* ── Diagonal bar ── */}
    <line x1="27" y1="37" x2="45" y2="55" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
    {/* ── ✕ second bar ── */}
    <line x1="45" y1="37" x2="27" y2="55" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   MATERIAL CONFIG
═══════════════════════════════════════════════════════════════════ */
type RecyclableMat = {
  id:    WasteType;
  css:   string;
  name:  string;
  earn:  string;
  svg:   React.ReactNode;
};

const RECYCLABLES: RecyclableMat[] = [
  { id: "PET",       css: "pet", name: "PET Plastic", earn: "Rs 100 / kg", svg: <SvgPET /> },
  { id: "PAPER",     css: "ppr", name: "Paper",        earn: "Rs 50 / kg",  svg: <SvgPaper /> },
  { id: "CARDBOARD", css: "crd", name: "Cardboard",    earn: "Rs 80 / kg",  svg: <SvgCardboard /> },
  { id: "METAL",     css: "mtl", name: "Metal",        earn: "Rs 120 / kg", svg: <SvgMetal /> },
];

/* ═══════════════════════════════════════════════════════════════════
   SMALL ICON COMPONENTS
═══════════════════════════════════════════════════════════════════ */
const TickIcon = ({ size = 9 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 8" fill="none">
    <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="var(--sw-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);
const PinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);


const STEP_LABELS = ["Waste Type", "Weight & Photo", "Location", "Notes"];

function Stepper({ active }: { active: number }) {
  return (
    <div className="sw-stepper">
      {STEP_LABELS.map((label, i) => {
        const s = i < active ? "done" : i === active ? "active" : "idle";
        return (
          <React.Fragment key={i}>
            <div className="sw-step-item">
              <div className={`sw-step-circle ${s}`}>
                {s === "done" ? <TickIcon /> : i + 1}
              </div>
              <span className={`sw-step-lbl ${s}`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`sw-step-line ${s === "done" ? "done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}


function CitizenRequestView() {
  const { user }  = useAuthContext();
  const navigate  = useNavigate();

  const [selectedType,  setSelectedType]  = useState<WasteType>("PET");
  const [photoPreview,  setPhotoPreview]  = useState<string | null>(null);
  const [photoName,     setPhotoName]     = useState<string>("");
  const [pickupLoc,     setPickupLoc]     = useState<LatLng | null>(null);
  const [savedAddrs,    setSavedAddrs]    = useState<SavedAddresses[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register, handleSubmit, setValue,
    formState: { errors, isSubmitting },
    reset, control, watch,
  } = useForm({
    resolver: yupResolver(schema), mode: "onTouched",
    defaultValues: {
      wasteType: "PET", estimatedWeight: undefined,
      pickupAddress: "", notes: "",
      photo: undefined, latitude: undefined, longitude: undefined,
    },
  });

  const wWeight  = watch("estimatedWeight");
  const wAddress = watch("pickupAddress");
  const activeStep = !wWeight ? 1 : !wAddress ? 2 : 3;


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickupLoc([pos.coords.latitude, pos.coords.longitude]);
        setValue("latitude",  pos.coords.latitude);
        setValue("longitude", pos.coords.longitude);
      },
      (err) => console.error("Geolocation error:", err),
    );
  }, [setValue]);

  async function getAddress(loc: LatLng | null) {
    if (!loc) return null;
    try {
      const r = await fetch(`/api/reverse-geocode?lat=${loc[0]}&lon=${loc[1]}`);
      if (!r.ok) throw new Error();
      return (await r.json()).address;
    } catch { return null; }
  }

  useEffect(() => {
    if (pickupLoc)
      getAddress(pickupLoc).then(a => { if (a) setValue("pickupAddress", a); });
  }, [pickupLoc]);


  useEffect(() => {
    if (!user?.userId) return;
    getSavedAddresses(user.userId)
      .then(r => setSavedAddrs(r.savedAddresses))
      .catch(() => toast.error("Failed to fetch saved addresses"));
  }, [user?.userId]);

  const { ref: photoRef, ...photoRest } = register("photo");

  const selectType = (wt: WasteType) => {
    setSelectedType(wt);
    setValue("wasteType", wt, { shouldValidate: true, shouldDirty: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPhotoName(files[0].name);
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else { setPhotoName(""); setPhotoPreview(null); }
  };

  const handleReset = () => {
    reset(); setSelectedType("PET");
    setPhotoPreview(null); setPhotoName("");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const fd = new FormData();
      fd.append("wasteType",       data.wasteType);
      fd.append("estimatedWeight", data.estimatedWeight.toString());
      fd.append("pickupAddress",   data.pickupAddress);
      fd.append("notes",           data.notes || "");
      if (data.photo && data.photo.length > 0) fd.append("photo", data.photo[0]);

      const condition =
        data.wasteType === "NON_RECYCLABLE" ? "CONTAMINATED" :
        ["PET", "CARDBOARD", "METAL"].includes(data.wasteType) ? "PROPER" : "MIXED";

      fd.append("latitude",  String(data.latitude));
      fd.append("longitude", String(data.longitude));
      fd.append("condition", condition);

      await submitPickupRequest(fd);
      toast.success("Pickup request submitted successfully!");
      handleReset();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };


  return (
    <>
      <style>{STYLES}</style>

      <main className="sw" style={{ padding: "clamp(24px,4vw,44px) clamp(16px,4vw,32px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          <div className="sw-header sw-a">
            <div className="sw-eyebrow">
              <div className="sw-eyebrow-dot">
                {/* same recycling icon as logo badge */}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <polyline points="23 20 23 14 17 14"/>
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                </svg>
              </div>
              <span className="sw-eyebrow-lbl">New Pickup Request</span>
            </div>

            {/* Title mirrors logo typography: 'Outfit' 800, brand word green */}
            <h1 className="sw-title">
              Schedule a <span className="sw-title-green">Waste Collection</span>
            </h1>
            <p className="sw-subtitle">
              Select your waste material, confirm your location, and a{" "}
              <strong style={{ color: "var(--sw-600)", fontWeight: 700 }}>SmartWaste</strong>{" "}
              collector will be dispatched to you.
            </p>
          </div>

          {/* ── Stepper ── */}
          <div className="sw-a sw-a1">
            <Stepper active={activeStep} />
          </div>

          {/* ── Main Form Card ── */}
          <div className="sw-card sw-a sw-a2">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* ════ STEP 1 — Waste Type ════ */}
              <div className="sw-section">
                <div className="sw-sec-head">
                  <div className="sw-sec-num">1</div>
                  <div>
                    <p className="sw-sec-title">Select Your Waste Material</p>
                    <p className="sw-sec-desc">
                      Choose the exact material — your per-kg cash earnings are based on this selection
                    </p>
                  </div>
                </div>

                {/* ─── Recyclable group ─── */}
                <div className="sw-cat-group">
                  <div className="sw-cat-strip">
                    <span className="sw-cat-pill recycle">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"/>
                        <polyline points="23 20 23 14 17 14"/>
                        <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                      </svg>
                      Recyclable Materials
                    </span>
                    <div className="sw-cat-divider" />
                    <span className="sw-cat-note">Earns cash rewards ♻️</span>
                  </div>

                  <div className="sw-mat-grid">
                    {RECYCLABLES.map(mat => {
                      const sel = selectedType === mat.id;
                      return (
                        <div
                          key={mat.id}
                          role="button" tabIndex={0} aria-pressed={sel}
                          className={`sw-mat-card ${mat.css}${sel ? " selected" : ""}`}
                          onClick={() => selectType(mat.id)}
                          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") selectType(mat.id); }}
                        >
                          {/* Tick */}
                          <div className="sw-mat-tick"><TickIcon /></div>
                          {/* Illustration */}
                          <div className={`sw-illus-box ${mat.css}`}>{mat.svg}</div>
                          {/* Name */}
                          <p className="sw-mat-name">{mat.name}</p>
                          {/* Earnings badge */}
                          <span className="sw-mat-earn">
                            <svg width="7" height="7" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3.5" fill="var(--sw-600)"/>
                            </svg>
                            {mat.earn}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ─── Non-Recyclable group ─── */}
                <div className="sw-cat-group">
                  <div className="sw-cat-strip">
                    <span className="sw-cat-pill non">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                      Non-Recyclable
                    </span>
                    <div className="sw-cat-divider" />
                    <span className="sw-cat-note">Disposal only — no earnings</span>
                  </div>

                  {/* Wide horizontal card */}
                  <div
                    role="button" tabIndex={0}
                    aria-pressed={selectedType === "NON_RECYCLABLE"}
                    className={`sw-non-card${selectedType === "NON_RECYCLABLE" ? " selected" : ""}`}
                    onClick={() => selectType("NON_RECYCLABLE")}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") selectType("NON_RECYCLABLE"); }}
                  >
                    {/* Illustration */}
                    <div className="sw-non-illus"><SvgTrash /></div>

                    {/* Text info */}
                    <div className="sw-non-info">
                      <p className="sw-non-name">Non-Recyclable Waste</p>
                      <p className="sw-non-desc">
                        General household trash, food scraps, sanitary products, and
                        contaminated materials that cannot enter the recycling stream.
                      </p>
                      <span className="sw-non-tag">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        No cash reward — safe disposal only
                      </span>
                    </div>

                    {/* Tick */}
                    <div className="sw-non-check-col">
                      <div className="sw-non-check"><TickIcon size={11} /></div>
                    </div>
                  </div>
                </div>

                {errors.wasteType && (
                  <p className="sw-err-msg" style={{ marginTop: 10 }}>
                    <WarnIcon />{errors.wasteType.message}
                  </p>
                )}
              </div>

              {/* ════ STEP 2 — Weight & Photo ════ */}
              <div className="sw-section">
                <div className="sw-sec-head">
                  <div className="sw-sec-num">2</div>
                  <div>
                    <p className="sw-sec-title">Quantity & Documentation</p>
                    <p className="sw-sec-desc">Estimate the weight and optionally attach a photo of your waste</p>
                  </div>
                </div>

                <div className="sw-2col">
                  {/* Weight */}
                  <div className="sw-field">
                    <label htmlFor="estimatedWeight" className="sw-label">
                      Estimated Weight <span className="req">*</span>
                    </label>
                    <div className="sw-input-wrap">
                      <input
                        id="estimatedWeight"
                        {...register("estimatedWeight")}
                        type="number" step="0.1" min="0" placeholder="0.0"
                        className={`sw-input${errors.estimatedWeight ? " err" : ""}`}
                        style={{ paddingRight: 52 }}
                      />
                      <span className="sw-suffix">kg</span>
                    </div>
                    {errors.estimatedWeight
                      ? <p className="sw-err-msg"><WarnIcon />{errors.estimatedWeight.message}</p>
                      : <p className="sw-hint">Final weight verified by collector on arrival</p>}
                  </div>

                  {/* Photo */}
                  <div className="sw-field">
                    <label className="sw-label">
                      Photo of Waste <span className="opt">(optional)</span>
                    </label>
                    <input
                      id="photoInput" type="file"
                      accept="image/jpg,image/jpeg,image/png,image/gif"
                      style={{ display: "none" }}
                      {...photoRest}
                      ref={e => {
                        photoRef(e);
                        (fileInputRef as React.RefObject<HTMLInputElement | null>).current = e;
                      }}
                      onChange={e => { photoRest.onChange(e); handleFileChange(e); }}
                    />
                    <div
                      role="button" tabIndex={0}
                      className={`sw-upload${errors.photo ? " err" : ""}${photoPreview ? " filled" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                    >
                      {photoPreview
                        ? <img src={photoPreview} alt="Waste preview"
                            style={{ height: 68, maxWidth: "100%", objectFit: "contain",
                              borderRadius: 8, marginBottom: 4 }}/>
                        : <div className="sw-upload-icon"><UploadIcon /></div>}
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-700)" }}>
                        {photoName || "Click to upload"}
                      </p>
                      <p style={{ fontSize: 11.5, color: "var(--ink-400)" }}>
                        PNG, JPG, GIF — max 5 MB
                      </p>
                    </div>
                    {errors.photo && <p className="sw-err-msg">{errors.photo.message as string}</p>}
                  </div>
                </div>
              </div>

              {/* ════ STEP 3 — Location ════ */}
              <div className="sw-section">
                <div className="sw-sec-head">
                  <div className="sw-sec-num">3</div>
                  <div>
                    <p className="sw-sec-title">Pickup Location</p>
                    <p className="sw-sec-desc">Auto-filled from your GPS — edit or select a saved address</p>
                  </div>
                </div>

                <div className="sw-addr-box">
                  <div className="sw-addr-head">
                    <div className="sw-addr-icon"><PinIcon /></div>
                    <div>
                      <p className="sw-addr-title">Your Current Location</p>
                      <p className="sw-addr-sub">Detected via GPS · Edit freely or choose a saved address</p>
                    </div>
                  </div>
                  <div className="sw-addr-body">
                    <Controller
                      name="pickupAddress" control={control}
                      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                        <div style={{ position: "relative" }}>
                          <Listbox
                            value={value}
                            onChange={v => {
                              onChange(v);
                              const found = savedAddrs.find(a => a.address === v);
                              if (found) {
                                setValue("latitude",  found.latitude);
                                setValue("longitude", found.longitude);
                              }
                            }}
                          >
                            <div style={{ position: "relative" }}>
                              <div className={`sw-combo${error ? " err" : ""}`}>
                                <input
                                  type="text" value={value} onChange={onChange}
                                  placeholder="Fetching your location…"
                                  className="sw-combo-in"
                                />
                                {savedAddrs.length > 0 && (
                                  <ListboxButton ref={ref} className="sw-saved-btn">
                                    Saved <ChevronIcon />
                                  </ListboxButton>
                                )}
                              </div>

                              {savedAddrs.length > 0 && (
                                <ListboxOptions transition className="sw-dropdown">
                                  <p className="sw-dropdown-hdr">Saved Addresses</p>
                                  {savedAddrs.map(item => (
                                    <ListboxOption key={item.addressId} value={item.address}>
                                      {({ active, selected }: { active: boolean; selected: boolean }) => (
                                        <div className="sw-dropdown-row"
                                          style={{ background: active ? "var(--sw-50)" : "" }}>
                                          {selected
                                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                                stroke="var(--sw-600)" strokeWidth="3"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                              </svg>
                                            : <div style={{ width: 14 }} />}
                                          <span style={{ fontWeight: selected ? 600 : 400 }}>
                                            {item.address}
                                          </span>
                                        </div>
                                      )}
                                    </ListboxOption>
                                  ))}
                                </ListboxOptions>
                              )}
                            </div>
                          </Listbox>
                          {error && <p className="sw-err-msg" style={{ marginTop: 6 }}>{error.message}</p>}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {errors.pickupAddress && (
                  <p className="sw-err-msg" style={{ marginTop: 8 }}>
                    {errors.pickupAddress.message}
                  </p>
                )}
              </div>

              {/* ════ STEP 4 — Notes ════ */}
              <div className="sw-section">
                <div className="sw-sec-head">
                  <div className="sw-sec-num">4</div>
                  <div>
                    <p className="sw-sec-title">Additional Notes</p>
                    <p className="sw-sec-desc">Any special instructions for the collector?</p>
                  </div>
                </div>
                <div className="sw-field">
                  <textarea
                    id="notes" {...register("notes")} rows={3}
                    placeholder="e.g. Gate code 1234 · Bags near the blue bin · Please call before arriving…"
                    className="sw-input"
                    style={{ resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }}
                  />
                  {errors.notes && <p className="sw-err-msg">{errors.notes.message}</p>}
                </div>
              </div>

              {/* ════ Footer Actions ════ */}
              <div className="sw-footer">
                <button type="submit" disabled={isSubmitting} className="sw-btn-submit">
                  {isSubmitting
                    ? <><div className="sw-spinner"/>Submitting…</>
                    : <><SendIcon />Submit Pickup Request</>}
                </button>
                <button type="button" onClick={handleReset} className="sw-btn-ghost">
                  Clear Form
                </button>
              </div>

            </form>
          </div>

          {/* ── Info Banner ── */}
          <div className="sw-banner sw-a sw-a3">
            <div className="sw-banner-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="var(--sw-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13.5,
                fontWeight: 700, color: "var(--sw-800)", marginBottom: 5,
              }}>
                Maximize your earnings per kilogram
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.65 }}>
                Clean, well-separated metal earns up to{" "}
                <strong style={{ color: "var(--sw-700)" }}>Rs 120 / kg</strong> — the highest rate
                on the platform. Read our{" "}
                <button type="button" onClick={() => navigate("/citizen/guidelines")}
                  style={{
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
                    color: "var(--sw-600)", textDecoration: "underline",
                    textDecorationThickness: 1.5, textUnderlineOffset: 2,
                  }}>
                  Recycling Guide
                </button>{" "}
                to learn how to prepare your waste properly.
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default CitizenRequestView;