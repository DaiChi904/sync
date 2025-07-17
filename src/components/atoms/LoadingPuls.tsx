import Box from "./Box";

export default function LoadingPuls() {
  return (
    <Box
      style={{
        width: 20,
        aspectRatio: 1,
        borderRadius: "50%",
        background: "#000",
        boxShadow: "0 0 0 0 #0004",
        animation: "l1 1s infinite",
      }}
    >
      <style>
        {`
                @keyframes l1 {
                    100% { box-shadow: 0 0 0 30px #0000 }
                }
                `}
      </style>
    </Box>
  );
}
