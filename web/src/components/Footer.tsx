import { Box, Container, Grid, Typography } from "@mui/material";


export default function Footer() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
        >
            <Container maxWidth="lg">
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography data-testid="footer-msg" component="p">
                            © {`${new Date().getFullYear()}`} github.com/AlvinHon. All Rights Reserved.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}