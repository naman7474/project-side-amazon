import Box from "@mui/material/Box";

const DashboardSeller = ({ sellerId }: { sellerId: string }) => {
  return (
    <Box>
      <iframe
        src={`https://app.appsmith.com/app/xpertseller/home-6693479bfe17d5481d5c1f00?seller_id=${sellerId}`}
        style={{ width: "100%", border: "none", height: "100vh" }}
      />
    </Box>
  );
};

export default DashboardSeller;
