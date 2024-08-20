import { IconButton } from "@mui/material";


export default function ClickableIconButton(
    { onClickAction, children, ...props }: { onClickAction: () => void, children: React.ReactNode, props?: any }
) {
    return (
        <IconButton
            {...props}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={(e) => {
                e.preventDefault();
                onClickAction()
            }}
        >
            {children}
        </IconButton>
    )
}