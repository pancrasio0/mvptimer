import { Button, Sizes } from './styles';

type ModalPrimaryButtonProps = {
  children: React.ReactNode;
  size?: Sizes;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ModalPrimaryButton({
  children,
  ...props
}: ModalPrimaryButtonProps) {
  return <Button {...props}>{children}</Button>;
}
