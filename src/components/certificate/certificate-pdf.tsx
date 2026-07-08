import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 60,
    fontFamily: "Helvetica",
  },
  border: {
    borderWidth: 3,
    borderColor: "#e11d2e",
    padding: 40,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#111111",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    marginBottom: 24,
    textAlign: "center",
  },
  line: {
    fontSize: 12,
    color: "#555555",
    marginBottom: 6,
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#e11d2e",
    marginVertical: 16,
    textAlign: "center",
  },
  trainingTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    marginVertical: 12,
    textAlign: "center",
  },
  footer: {
    marginTop: 40,
    fontSize: 9,
    color: "#888888",
    textAlign: "center",
  },
});

export function CertificatePdf({
  participantName,
  trainingTitle,
  issuedAt,
  certificateNumber,
  verificationUrl,
}: {
  participantName: string;
  trainingTitle: string;
  issuedAt: Date;
  certificateNumber: string;
  verificationUrl: string;
}) {
  const formattedDate = issuedAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <Text style={styles.brand}>TEPSON ART GROUP</Text>
          <Text style={styles.title}>Certificat de réussite</Text>
          <Text style={styles.line}>Ce certificat est décerné à</Text>
          <Text style={styles.name}>{participantName}</Text>
          <Text style={styles.line}>pour avoir complété avec succès la formation</Text>
          <Text style={styles.trainingTitle}>{trainingTitle}</Text>
          <Text style={styles.line}>Délivré le {formattedDate}</Text>
          <View style={styles.footer}>
            <Text>Numéro de certificat : {certificateNumber}</Text>
            <Text>Vérifiez ce certificat : {verificationUrl}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
