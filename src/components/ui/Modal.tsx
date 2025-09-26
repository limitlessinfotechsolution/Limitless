import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  preventCloseOnBackdrop?: boolean;
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
  showMinimizeButton?: boolean;
  animation?: 'slide' | 'fade' | 'scale' | 'flip' | 'none';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backdropBlur?: boolean;
  backdropOpacity?: number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
  maxHeight?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  headerClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  preventCloseOnBackdrop = false,
  showCloseButton = true,
  showMaximizeButton = false,
  showMinimizeButton = false,
  animation = 'slide',
  position = 'center',
  backdropBlur = true,
  backdropOpacity = 50,
  rounded = '2xl',
  shadow = 'xl',
  maxWidth = '2xl',
  maxHeight = 'xl',
  headerClassName = '',
  bodyClassName = '',
  footer,
  footerClassName = '',
  closeOnEscape = true,
  closeOnOutsideClick = true,
  initialFocusRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full',
  };

  const maxHeightClasses = {
    sm: 'max-h-64',
    md: 'max-h-80',
    lg: 'max-h-96',
    xl: 'max-h-[32rem]',
    full: 'max-h-[90vh]',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    none: '',
  };

  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-10',
    bottom: 'items-end justify-center pb-10',
    left: 'items-center justify-start pl-10',
    right: 'items-center justify-end pr-10',
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the initial element if provided
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape, initialFocusRef]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOutsideClick && !preventCloseOnBackdrop) {
      onClose();
    }
  };

  const getAnimation = () => {
    switch (animation) {
      case 'slide':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          },
          modal: {
            initial: { 
              opacity: 0, 
              y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0,
              x: position === 'left' ? -100 : position === 'right' ? 100 : 0,
              scale: 0.9
            },
            animate: { opacity: 1, y: 0, x: 0, scale: 1 },
            exit: { 
              opacity: 0, 
              y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0,
              x: position === 'left' ? -100 : position === 'right' ? 100 : 0,
              scale: 0.9,
              transition: { duration: 0.2 }
            },
            transition: { type: "spring" as const, damping: 25, stiffness: 300 }
          }
        };
      case 'fade':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          },
          modal: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0, transition: { duration: 0.2 } },
            transition: { duration: 0.3 }
          }
        };
      case 'scale':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          },
          modal: {
            initial: { opacity: 0, scale: 0.7 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.7, transition: { duration: 0.2 } },
            transition: { type: "spring" as const, damping: 25, stiffness: 300 }
          }
        };
      case 'flip':
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          },
          modal: {
            initial: { opacity: 0, rotateX: 90 },
            animate: { opacity: 1, rotateX: 0 },
            exit: { opacity: 0, rotateX: 90, transition: { duration: 0.2 } },
            transition: { duration: 0.3 }
          }
        };
      default:
        return {
          backdrop: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          },
          modal: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 }
          }
        };
    }
  };

  const animationProps = getAnimation();

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex ${positionClasses[position]} p-4 ${backdropBlur ? 'backdrop-blur-sm' : ''} bg-black/${backdropOpacity}`}
          initial={animationProps.backdrop.initial}
          animate={animationProps.backdrop.animate}
          exit={animationProps.backdrop.exit}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className={`relative w-full ${isMaximized ? 'max-w-full max-h-full' : maxWidthClasses[maxWidth]} ${isMaximized ? 'max-h-full' : maxHeightClasses[maxHeight]} overflow-y-auto bg-white dark:bg-gray-800 ${roundedClasses[rounded]} ${shadowClasses[shadow]}`}
            initial={animationProps.modal.initial}
            animate={animationProps.modal.animate}
            exit={animationProps.modal.exit}
            transition={animationProps.modal.transition}
          >
            {(title || showCloseButton || showMaximizeButton || showMinimizeButton) && (
              <div className={`border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between ${headerClassName}`}>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                
                <div className="flex items-center space-x-2">
                  {showMinimizeButton && (
                    <button
                      onClick={toggleMaximize}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label={isMaximized ? "Minimize" : "Maximize"}
                    >
                      {isMaximized ? (
                        <Minimize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  {showMaximizeButton && !showMinimizeButton && (
                    <button
                      onClick={toggleMaximize}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Maximize"
                    >
                      <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={`p-6 ${bodyClassName}`}>
              {children}
            </div>
            
            {footer && (
              <div className={`border-t border-gray-200 dark:border-gray-700 px-6 py-4 ${footerClassName}`}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;