# BM WA03.001 Mathematical Step-by-Step Reconciliation

## Executive Overview
This document provides an independent, full step-by-step mathematical reconciliation for the golden test fixture calculation producing **$ER_y = 21,406 \text{ tCO}_2\text{e}$** under Bureau of Energy Efficiency (BEE) CCTS Methodology **BM WA03.001** (Landfill Methane Recovery & Avoidance).

---

## 1. Methodology Equations
Under BEE CCTS **BM WA03.001**:

$$ER_y = BE_y - PE_y - LE_y$$

Where:
- $ER_y$: Emission reductions achieved by the project activity in year $y$ ($\text{tCO}_2\text{e}$)
- $BE_y$: Baseline emissions in year $y$ ($\text{tCO}_2\text{e}$)
- $PE_y$: Project emissions in year $y$ ($\text{tCO}_2\text{e}$)
- $LE_y$: Leakage emissions in year $y$ ($\text{tCO}_2\text{e}$)

### Baseline Emissions Equation
$$BE_y = (F_{\text{CH4,PJ,y}} - F_{\text{CH4,BL,y}}) \times \text{GWP}_{\text{CH4}} \times (1 - O_f)$$

Where:
- $F_{\text{CH4,PJ,y}}$: Amount of methane captured and destroyed/utilised by the project activity ($\text{tCH}_4/\text{yr}$)
- $F_{\text{CH4,BL,y}}$: Amount of methane that would have been captured and destroyed in the baseline scenario ($\text{tCH}_4/\text{yr}$)
- $\text{GWP}_{\text{CH4}}$: Global Warming Potential of Methane = **$28 \text{ tCO}_2\text{e}/\text{tCH}_4$** (IPCC AR5 / BEE standard)
- $O_f$: Oxidation factor of top cover soil = **$0.10$** (10% natural topsoil oxidation)

---

## 2. Input Dataset & Parameters (Golden Test Fixture)

| Parameter Code | Description | Value | Unit | Source / Standard |
| :--- | :--- | :--- | :--- | :--- |
| $F_{\text{CH4,PJ,y}}$ | Methane captured by project LFG flare/generator | **$1,000$** | $\text{tCH}_4/\text{yr}$ | Gas Flow Meter + Methane Analyzer |
| $F_{\text{CH4,BL,y}}$ | Baseline methane capture (pre-project regulatory obligation) | **$150$** | $\text{tCH}_4/\text{yr}$ | Historical Baseline Audit |
| $\text{GWP}_{\text{CH4}}$ | Global Warming Potential of Methane | **$28$** | $\text{tCO}_2\text{e}/\text{tCH}_4$ | IPCC AR5 / BEE CCTS Registry |
| $O_f$ | Topsoil Methane Oxidation Factor | **$0.10$** | dimensionless | Default BEE CCTS standard |
| $PE_y$ | Project electricity & auxiliary fuel emissions | **$14$** | $\text{tCO}_2\text{e}/\text{yr}$ | On-site Electricity Meter |
| $LE_y$ | Leakage emissions from transportation/equipment | **$0$** | $\text{tCO}_2\text{e}/\text{yr}$ | Verified zero leakage boundary |

---

## 3. Step-by-Step Intermediate Calculation Trace

### Step 3.1: Net Methane Destroyed Above Baseline ($\Delta F_{\text{CH4}}$)
$$\Delta F_{\text{CH4}} = F_{\text{CH4,PJ,y}} - F_{\text{CH4,BL,y}}$$
$$\Delta F_{\text{CH4}} = 1,000 \text{ tCH}_4 - 150 \text{ tCH}_4 = \mathbf{850 \text{ tCH}_4/\text{yr}}$$

### Step 3.2: Baseline Methane CO₂ Equivalent Before Oxidation Adjustment
$$BE_{\text{raw}} = \Delta F_{\text{CH4}} \times \text{GWP}_{\text{CH4}}$$
$$BE_{\text{raw}} = 850 \text{ tCH}_4 \times 28 \text{ tCO}_2\text{e}/\text{tCH}_4 = \mathbf{23,800 \text{ tCO}_2\text{e}/\text{yr}}$$

### Step 3.3: Baseline Emissions After Soil Oxidation Factor ($O_f = 0.10$)
$$BE_y = BE_{\text{raw}} \times (1 - O_f)$$
$$BE_y = 23,800 \text{ tCO}_2\text{e} \times (1 - 0.10) = 23,800 \times 0.90 = \mathbf{21,420 \text{ tCO}_2\text{e}/\text{yr}}$$

### Step 3.4: Final Emission Reductions ($ER_y$)
$$ER_y = BE_y - PE_y - LE_y$$
$$ER_y = 21,420 \text{ tCO}_2\text{e} - 14 \text{ tCO}_2\text{e} - 0 \text{ tCO}_2\text{e} = \mathbf{21,406 \text{ tCO}_2\text{e}/\text{yr}}$$

---

## 4. Verification Summary
- **Calculated Result**: $21,406 \text{ tCO}_2\text{e}$
- **Golden Fixture Output**: $21,406 \text{ tCO}_2\text{e}$
- **Reconciliation Status**: **100% MATHEMATICALLY VERIFIED & REPRODUCIBLE**.
