import { useCallback } from "react";
import Swal, {SweetAlertPosition} from "sweetalert2";
import {CustomError} from "../types/customError.types.ts";

export const useNotifications = () => {
    const showError = useCallback((error: CustomError) => {
        Swal.fire({
            icon: 'error',
            title: error?.code ?? "Error",
            text: error?.message,
            heightAuto: false,
        });
    }, []);

    const showToast = useCallback(({
           icon = "info",
           title = "",
           text = "",
           position = "top-right",
           timer = 3000,
           timerProgressBar = false,
       }: {
        icon?: string,
        title?: string,
        text?: string,
        position?: SweetAlertPosition,
        timer?: number,
        timerProgressBar?: boolean
    }) => {
        Swal.fire({
            toast: true,
            icon,
            title,
            text,
            position,
            timer,
            timerProgressBar,
            showConfirmButton: false,
        });
    }, []);

    const showSuccess = useCallback((message: string) => {
        Swal.fire({
            icon: "success",
            title: 'Success',
            text: message,
            heightAuto: false,
        });
    }, []);

    const showLoading = useCallback(({title = 'Cargando', text = 'Por favor espera...', onDismiss}: { title: string, text: string, onDismiss?: () => void }) => {
        Swal.fire({
            title,
            html: `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
          ${text}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="100" height="100" style="shape-rendering: auto; display: block; background: transparent;"><g><circle stroke-linecap="round" fill="none" stroke-dasharray="50.26548245743669 50.26548245743669" stroke="#4893cd" stroke-width="8" r="32" cy="50" cx="50">
            <animateTransform values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform>
          </circle></g></svg>
        </div>
      `,
            heightAuto: false,
            allowOutsideClick: false,
            showCancelButton: true,
            showConfirmButton: false,
        }).then(result => {
            if (result.isDismissed && onDismiss) {
                onDismiss();
            }
        });
    }, []);

    const confirmAction = useCallback(async ({
         title = '¿Estás seguro?',
         text = '',
         html = '',
         icon = 'question',
         confirmButtonText = 'Aceptar',
         cancelButtonText = 'Cancelar',
         heightAuto = false,
         onConfirm,
         onCancel,
         loadingTitle,
         loadingMessage,
     }: {
        title?: string,
        text?: string,
        html?: string,
        icon?: string,
        confirmButtonText?: string,
        cancelButtonText?: string,
        heightAuto?: boolean,
        onConfirm: () => Promise<void> | void,
        onCancel?: () => void,
        loadingTitle?: string,
        loadingMessage?: string,
    }) => {
        const { isConfirmed, isDismissed } = await Swal.fire({
            title,
            text: text || undefined,
            html: html || undefined,
            icon,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText,
            cancelButtonText,
            heightAuto,
        });

        if (isConfirmed) {
            if (loadingMessage) {
                showLoading({
                    text: loadingTitle || 'Loading',
                    title: loadingMessage,
                });
            }
            if (onConfirm) {
                await onConfirm();
            }
        } else if (isDismissed && onCancel) {
            onCancel();
        }
    }, [showLoading]);

    return {
        showError,
        showToast,
        showSuccess,
        showLoading,
        confirmAction,
    };
};
