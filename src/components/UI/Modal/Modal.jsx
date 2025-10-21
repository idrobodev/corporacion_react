import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useIsMobile } from 'shared/hooks';

/**
 * Modal component with overlay, animations, and accessibility features
 * Automatically fullscreen on mobile devices
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} props.size - Modal size
 * @param {boolean} props.showCloseButton - Show close button in header
 * @param {boolean} props.closeOnOverlayClick - Close when clicking overlay
 * @param {boolean} props.closeOnEsc - Close when pressing ESC
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {string} props.className - Additional CSS classes
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
  className = ''
}) => {
  const modalRef = useRef(null);
  const isMobile = useIsMobile();

  // Size styles - fullscreen on mobile
  const sizeStyles = isMobile 
    ? 'w-full h-full max-w-full max-h-full rounded-none' 
    : {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4'
      }[size];

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn ${isMobile ? '' : 'flex items-center justify-center p-4'}`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white shadow-2xl w-full overflow-y-auto animate-slideUp ${sizeStyles} ${isMobile ? 'h-full' : 'rounded-xl max-h-[90vh]'} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header - fijo en móvil */}
        <div className={`flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white z-10 ${isMobile ? 'sticky top-0' : 'rounded-t-xl'}`}>
          <h3 id="modal-title" className="text-lg md:text-xl font-semibold text-gray-800 flex-1 truncate pr-4">
            {title}
          </h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Cerrar modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          )}
        </div>

        {/* Body - con padding bottom extra en móvil para footer fijo */}
        <div className={`p-4 md:p-6 ${isMobile && footer ? 'pb-24' : ''}`}>
          {children}
        </div>

        {/* Footer - fijo en móvil */}
        {footer && (
          <div className={`flex justify-end p-4 md:p-6 border-t border-gray-200 space-x-3 bg-white ${isMobile ? 'fixed bottom-0 left-0 right-0' : 'rounded-b-xl'}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render in portal
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  footer: PropTypes.node,
  className: PropTypes.string
};

export default Modal;
