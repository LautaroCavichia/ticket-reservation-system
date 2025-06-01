/**
 * Utility functions for formatting data display.
 * 
 * Provides consistent formatting for dates, currencies,
 * and other data types across the application.
 */

/**
 * Format a date string or Date object for display.
 */
export const formatDate = (
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
  
    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };
  
  /**
   * Format a date and time string for display.
   */
  export const formatDateTime = (
    date: string | Date,
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };
  
  /**
   * Format a number as currency.
   */
  export const formatCurrency = (
    amount: number,
    currency: string = 'EUR',
    locale: string = 'it-IT'
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };
  
  /**
   * Format a number as percentage.
   */
  export const formatPercentage = (
    value: number,
    decimals: number = 1
  ): string => {
    return `${value.toFixed(decimals)}%`;
  };
  
  /**
   * Format a large number with abbreviations (K, M, B).
   */
  export const formatCompactNumber = (num: number): string => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  /**
   * Format time remaining until a date.
   */
  export const formatTimeRemaining = (targetDate: string | Date): string => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const now = new Date();
    const diff = target.getTime() - now.getTime();
  
    if (diff <= 0) {
      return 'Expired';
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    }
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
    }
    
    return 'Less than a minute remaining';
  };
  
  /**
   * Truncate text to a specified length with ellipsis.
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Format a phone number for display.
   */
  export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
  };
  
  /**
   * Format file size in bytes to human readable format.
   */
  export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Format reservation status for display.
   */
  export const formatReservationStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'Pending Payment',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
    };
    
    return statusMap[status] || status;
  };
  
  /**
   * Format payment status for display.
   */
  export const formatPaymentStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'Payment Pending',
      completed: 'Payment Complete',
      failed: 'Payment Failed',
      refunded: 'Refunded',
    };
    
    return statusMap[status] || status;
  };