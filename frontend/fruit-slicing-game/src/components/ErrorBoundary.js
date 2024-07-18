import React, { Component } from 'react';
import ErrorScreen from './Error';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Bir hata oluştuğunda state'i güncelle
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hata bilgilerini bir hata raporlama servisine gönder
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Hata olduğunda hata ekranını göster
      return <ErrorScreen />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
