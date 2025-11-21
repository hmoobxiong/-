import { GoogleGenAI, Type } from "@google/genai";
import { DocumentData, DocType, DocStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';
const MODEL_SMART = 'gemini-2.5-flash'; // Using flash for speed/cost, change to pro if needed

/**
 * Extracts document details from a text description or simulated file content.
 * In a real app, this would handle base64 image data.
 */
export const extractDocumentInfo = async (fileData: string, mimeType: string): Promise<Partial<DocumentData>> => {
  try {
    const prompt = `
      Analyze the following document content (which might be an image description or text) and extract the metadata.
      Translate any information into Lao language where appropriate for the fields.
      Determine the document type and status based on context.
      Provide a short summary in Lao.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: {
        parts: [
          { text: prompt },
          { 
             inlineData: {
               mimeType: mimeType,
               data: fileData
             }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refNo: { type: Type.STRING, description: "The document reference number or ID" },
            title: { type: Type.STRING, description: "The main subject or title of the document in Lao" },
            fromDept: { type: Type.STRING, description: "Sender department or person in Lao" },
            date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
            summary: { type: Type.STRING, description: "A brief summary of the content in Lao" },
            type: { 
              type: Type.STRING, 
              enum: ['ຂາເຂົ້າ', 'ຂາອອກ', 'ພາຍໃນ', 'ສັນຍາ', 'ອື່ນໆ'],
              description: "Type of document"
            },
            status: {
              type: Type.STRING,
              enum: ['ຮ່າງ', 'ລໍຖ້າອະນຸມັດ', 'ອະນຸມັດແລ້ວ', 'ສຳເລັດ', 'ປະຕິເສດ'],
              description: "Current status inferred from text"
            }
          },
          required: ["title", "summary", "type"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<DocumentData>;
    }
    return {};
  } catch (error) {
    console.error("Error extracting info:", error);
    throw error;
  }
};

/**
 * Allows users to ask questions about the existing documents.
 */
export const queryDocuments = async (query: string, documents: DocumentData[]): Promise<string> => {
  try {
    // Prepare context from documents
    // In a real app with many docs, use a Vector DB or RAG. Here we just dump the JSON.
    const context = JSON.stringify(documents.map(d => ({
      id: d.refNo,
      title: d.title,
      date: d.date,
      summary: d.summary,
      status: d.status,
      from: d.fromDept
    })));

    const prompt = `
      You are an intelligent assistant for an office document system in Laos.
      User Query: "${query}"
      
      Here is the list of available documents in JSON format:
      ${context}

      Please answer the user's question based ONLY on the provided documents.
      Answer in Lao language. Be professional and concise.
      If the answer is not found in the documents, state that clearly.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_SMART,
      contents: prompt,
    });

    return response.text || "ຂໍອະໄພ, ບໍ່ສາມາດປະມວນຜົນໄດ້ໃນຂະນະນີ້.";
  } catch (error) {
    console.error("Error querying docs:", error);
    return "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບ AI.";
  }
};