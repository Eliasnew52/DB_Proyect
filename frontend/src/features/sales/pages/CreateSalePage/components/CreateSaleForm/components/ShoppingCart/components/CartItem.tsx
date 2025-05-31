import {Card, CardContent, Grid, IconButton, TextField, Typography} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {NumericFormat} from "react-number-format";
import {useCartStore} from "../../../../../../../store/useCartStore/useCartStore";
import {CartItem as CartItemType} from "../../../../../../../store/useCartStore/useCartStore.types"
import { useEffect, useState } from "react";

interface CartItemProps {
    item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
    const [inputValue, setInputValue] = useState<string>(String(item.quantity));
    const removeItem = useCartStore(state => state.removeItem);
    const updateQuantity = useCartStore(state => state.updateQuantity);

    useEffect(() => {
        setInputValue(String(item.quantity));
    }, [item.quantity]);

    return (
        <Card
            elevation={0}
            sx={{
                backgroundColor: 'grey.200'
            }}
        >
            <CardContent
                sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    '&:last-child': { paddingBottom: 2 }
                }}
            >
                <Grid>
                    <Typography fontSize={14} fontWeight="bold">
                        {item.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                    >
                        {item.sale_price.toLocaleString('es-NI', {
                            style: 'currency',
                            currency: 'NIO',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Stock: {item.stock}
                    </Typography>
                </Grid>

                <Grid
                    container
                    alignItems="center"
                >
                    <NumericFormat
                        customInput={TextField}
                        size={'small'}
                        value={item.quantity > 0 ? item.quantity : 1}
                        sx={{ width: 50 }}
                        allowNegative={false}                  
                        decimalScale={0}
                        allowLeadingZeros={true}
                        isAllowed={({ floatValue }) => {
                            return floatValue !== null && 
                                floatValue !== undefined && 
                                floatValue > 0 && 
                                floatValue <= item.stock;
                        }}
                        onValueChange={({ value }) => {
                            setInputValue(value); 
                            
                            if (value === "" || isNaN(Number(value))) return;
                            
                            const qty = Number(value);
                            if (qty > 0 && qty <= item.stock) {
                                updateQuantity(item.id, qty);
                            }
                        }}
                        onBlur={() => {
                            if (inputValue === "" || isNaN(Number(inputValue))) {
                                setInputValue("1");
                                updateQuantity(item.id, 1);
                            }
                        }}
                    />
                    <IconButton color={'error'} onClick={() => removeItem(item.id)}>
                        <DeleteOutlineOutlinedIcon />
                    </IconButton>
                </Grid>
            </CardContent>
        </Card>
    )
}