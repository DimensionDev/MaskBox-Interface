import { forwardRef, useRef, memo, useCallback } from 'react';
import {
  SnackbarProvider,
  SnackbarProviderProps,
  SnackbarKey,
  useSnackbar,
  VariantType,
  SnackbarMessage,
  SnackbarContent,
  SnackbarAction,
  OptionsObject,
} from 'notistack';
import classnames from 'classnames';
import { Icon } from '@/components';
import styles from './index.module.less';

export { SnackbarProvider, useSnackbar } from 'notistack';
export type { VariantType, OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';

// const useStyles = makeStyles()((theme, _, createRef) => {
//   const { palette } = theme;
//   const isDark = palette.mode === 'dark';
//   const spinningAnimationKeyFrames = keyframes`
// to {
//   transform: rotate(360deg)
// }`;
//
//   const title = {
//     ref: createRef(),
//     color: MaskColorVar.textPrimary,
//     fontWeight: 400,
//     fontSize: 14,
//     lineHeight: '20px',
//   } as const;
//   const message = {
//     ref: createRef(),
//     color: MaskColorVar.textSecondary,
//     fontWeight: 400,
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: 12,
//   } as const;
//   const defaultVariant = {
//     background: isDark ? '#17191D' : '#F7F9FA',
//     color: isDark ? '#D9D9D9' : '#0F1419',
//     [`& .${title.ref}`]: {
//       color: isDark ? '#D9D9D9' : palette.grey['800'],
//     },
//   };
//   const success = {
//     backgroundColor: '#60DFAB',
//     color: '#ffffff',
//     [`& .${title.ref}`]: {
//       color: 'inherit',
//     },
//     [`& .${message.ref}`]: {
//       color: 'inherit',
//     },
//   } as const;
//
//   const error = {
//     background: '#FF5F5F',
//     color: '#ffffff',
//     [`& .${title.ref}`]: {
//       color: 'inherit',
//     },
//     [`& .${message.ref}`]: {
//       color: 'inherit',
//     },
//   } as const;
//
//   const info = {
//     background: '#8CA3C7',
//     color: '#ffffff',
//     [`& .${title.ref}`]: {
//       color: 'inherit',
//     },
//     [`& .${message.ref}`]: {
//       color: 'inherit',
//     },
//   };
//
//   const warning = {
//     ref: createRef(),
//     backgroundColor: '#FFB915',
//     color: '#ffffff',
//     [`& .${title.ref}`]: {
//       color: 'inherit',
//     },
//     [`& .${message.ref}`]: {
//       color: 'inherit',
//     },
//   } as const;
//
//   return {
//     root: {
//       zIndex: 9999,
//       color: MaskColorVar.textLight,
//       pointerEvents: 'inherit',
//     },
//     content: {
//       alignItems: 'center',
//       padding: theme.spacing(1.5, 2),
//       borderRadius: 12,
//       width: 380,
//       flexWrap: 'nowrap !important' as 'nowrap',
//       [`&.${success.ref}`]: {
//         background: MaskColorVar.greenMain,
//         color: MaskColorVar.lightestBackground,
//       },
//       [`&.${error.ref}`]: {
//         background: MaskColorVar.redMain,
//         color: MaskColorVar.lightestBackground,
//         title: {
//           color: 'inherit',
//         },
//       },
//       [`&.${info.ref}`]: {
//         color: MaskColorVar.lightestBackground,
//       },
//       [`&.${warning.ref}`]: {
//         color: '#ffffff',
//       },
//     },
//     default: defaultVariant,
//     success,
//     error,
//     info,
//     warning,
//     icon: {
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     action: {
//       marginLeft: 'auto',
//     },
//     closeButton: {
//       color: 'inherit',
//     },
//     texts: {
//       marginLeft: theme.spacing(2),
//     },
//     title,
//     message,
//     link: {
//       display: 'flex',
//       marginLeft: theme.spacing(0.5),
//     },
//   };
// });

export interface CustomSnackbarContentProps {
  id: SnackbarKey;
  title: SnackbarMessage;
  message?: string | React.ReactNode;
  icon?: React.ReactNode;
  processing?: boolean;
  variant?: VariantType;
  action?: SnackbarAction;
}

export const CustomSnackbarContent = forwardRef<HTMLDivElement, CustomSnackbarContentProps>(
  (props, ref) => {
    const snackbar = useSnackbar();
    let renderedAction = (
      <Icon type="close" size={24} onClick={() => snackbar.closeSnackbar(props.id)} />
    );
    if (props.action) {
      renderedAction = typeof props.action === 'function' ? props.action(props.id) : props.action;
    }
    return (
      <SnackbarContent ref={ref} className={classnames(styles.content, styles[props.variant!])}>
        <div className={styles.texts}>
          <h2 className={styles.title}>{props.title}</h2>
          {props.message && <p className={styles.message}>{props.message}</p>}
        </div>
        <div className={styles.action}>{renderedAction}</div>
      </SnackbarContent>
    );
  },
);

export const CustomSnackbarProvider = memo<SnackbarProviderProps>((props) => {
  const ref = useRef<SnackbarProvider>(null);
  const onDismiss = (key: string | number) => () => {
    ref.current?.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={ref}
      maxSnack={30}
      disableWindowBlurListener
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      hideIconVariant
      content={(key, title) => (
        <CustomSnackbarContent id={key} variant={props.variant ?? 'default'} title={title} />
      )}
      action={(key) => <Icon type="close" size={24} onClick={onDismiss(key)} />}
      classes={{
        containerRoot: styles.container,
        variantSuccess: styles.success,
        variantError: styles.error,
        variantInfo: styles.info,
        variantWarning: styles.warning,
      }}
      {...props}
    />
  );
});

export interface ShowSnackbarOptions
  extends OptionsObject,
    Pick<CustomSnackbarContentProps, 'message' | 'processing' | 'icon'> {}

export function useCustomSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const showSnackbar = useCallback(
    (
      text: SnackbarMessage,
      options: ShowSnackbarOptions = {
        variant: 'default',
      },
    ) => {
      const { processing, message, variant, ...rest } = options;
      return enqueueSnackbar(text, {
        variant: options.variant,
        content: (key, title) => {
          return (
            <CustomSnackbarContent
              id={key}
              variant={variant ?? 'default'}
              title={title}
              message={message}
              processing={processing}
              action={rest.action}
            />
          );
        },
        ...rest,
      });
    },
    [enqueueSnackbar],
  );

  return { showSnackbar, closeSnackbar };
}
