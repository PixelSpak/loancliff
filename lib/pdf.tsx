import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { CalcSuccess } from "@/lib/types";

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const styles = StyleSheet.create({
  page: {
    padding: 44,
    backgroundColor: "#faf9fc",
    color: "#1b1c1e",
    fontFamily: "Helvetica",
  },
  brand: {
    fontSize: 13,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    color: "#001229",
    marginBottom: 34,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#44474d",
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    lineHeight: 1.12,
    color: "#001229",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 1.55,
    color: "#44474d",
    marginBottom: 24,
  },
  gapBox: {
    backgroundColor: "#ffffff",
    border: "1 solid #c4c6ce",
    borderRadius: 8,
    padding: 24,
    marginBottom: 18,
  },
  gapLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#44474d",
    marginBottom: 8,
  },
  gapNumber: {
    fontSize: 48,
    color: "#ba1a1a",
    marginBottom: 10,
  },
  gapMeta: {
    fontSize: 11,
    color: "#44474d",
  },
  section: {
    backgroundColor: "#ffffff",
    border: "1 solid #c4c6ce",
    borderRadius: 8,
    padding: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#1b1c1e",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 9,
    marginBottom: 9,
  },
  rowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 10,
    color: "#44474d",
    maxWidth: "62%",
  },
  rowValue: {
    fontSize: 11,
    color: "#1b1c1e",
  },
  listItem: {
    fontSize: 10.5,
    lineHeight: 1.55,
    color: "#44474d",
    marginBottom: 6,
  },
  footnote: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: "#74777e",
    marginTop: 6,
  },
});

function GapReportDocument({ result }: { result: CalcSuccess }) {
  return (
    <Document
      title={`${result.schoolShortName} ${result.programShortLabel} Funding Gap Report`}
      author="Loan Cliff"
      subject="Graduate funding gap estimate"
    >
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>Loan Cliff</Text>
        <Text style={styles.eyebrow}>Personal funding gap report</Text>
        <Text style={styles.title}>
          {result.schoolShortName} {result.programShortLabel}
        </Text>
        <Text style={styles.subtitle}>
          Estimate based on published cost of attendance, program length, and
          projected federal borrowing caps for loans first disbursed on or after
          July 1, 2026.
        </Text>

        <View style={styles.gapBox}>
          <Text style={styles.gapLabel}>Total estimated uncovered cost</Text>
          <Text style={styles.gapNumber}>{currency(result.totalGap)}</Text>
          <Text style={styles.gapMeta}>
            {currency(result.gapPerYear)} per year over {result.lengthYears} years,
            or about {currency(result.monthlyEquivalent)} per month.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculation Breakdown</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Cost of attendance, IPEDS {result.citation.ipedsYear}
            </Text>
            <Text style={styles.rowValue}>{currency(result.coaPerYear)}/yr</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Projected federal cap for {result.category} programs
            </Text>
            <Text style={styles.rowValue}>{currency(result.capPerYear)}/yr</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Program length</Text>
            <Text style={styles.rowValue}>{result.lengthYears} years</Text>
          </View>
          <View style={styles.rowLast}>
            <Text style={styles.rowLabel}>Estimated total gap</Text>
            <Text style={styles.rowValue}>{currency(result.totalGap)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Next Steps</Text>
          <Text style={styles.listItem}>
            1. Confirm the current cost of attendance with {result.schoolName}.
          </Text>
          <Text style={styles.listItem}>
            2. Ask financial aid whether your borrower status or program timing
            changes how the 2026 rules apply.
          </Text>
          <Text style={styles.listItem}>
            3. Compare private lender terms before choosing a lender: APR, fixed
            versus variable rates, co-signer release, fees, and hardship options.
          </Text>
          <Text style={styles.listItem}>
            4. Check school-specific scholarships, assistantships, employer
            benefits, and lower-cost program alternatives before borrowing.
          </Text>
        </View>

        <Text style={styles.footnote}>
          Source: {result.citation.statute}. Loan Cliff provides educational
          estimates, not financial advice. Confirm eligibility, aid availability,
          and final borrowing terms with your school and lender.
        </Text>
      </Page>
    </Document>
  );
}

export async function renderGapReportPdf(result: CalcSuccess) {
  const buffer = await renderToBuffer(<GapReportDocument result={result} />);
  return Buffer.from(buffer);
}
