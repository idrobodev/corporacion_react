import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { DataTable, LoadingSpinner, ExportDropdown } from 'components/UI';
import { dbService } from 'shared/services';
import {
  arrayToCSV,
  downloadCSV,
  formatCurrencyForCSV,
  formatDateForCSV,
  normalizeStatus
} from 'shared/utils/exportUtils';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filterStatus, setFilterStatus] = useState('TODOS');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data } = await dbService.getMensualidades();
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapsed = () => setSidebarCollapsed(!sidebarCollapsed);

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === 'TODOS') return true;
    return payment.estado === filterStatus;
  });

  // Función para exportar a PDF
  const handleExportPDF = useCallback(() => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('es-ES');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Mensualidades - ${currentDate}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 24px;
            }
            .filters {
              margin-bottom: 20px;
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
            }
            .filters h3 {
              margin: 0 0 10px 0;
              color: #495057;
            }
            .filters p {
              margin: 5px 0;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #495057;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .stats {
              margin-top: 30px;
              background: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
            }
            .stats h3 {
              margin: 0 0 10px 0;
              color: #1976d2;
            }
            .stats p {
              margin: 5px 0;
              font-size: 14px;
            }
            .status-pagada { color: #059669; font-weight: bold; }
            .status-pendiente { color: #d97706; font-weight: bold; }
            .status-vencida { color: #dc2626; font-weight: bold; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lista de Mensualidades</h1>
            <p>Corporación Todo por un Alma</p>
            <p>Fecha de generación: ${currentDate}</p>
          </div>

          <div class="filters">
            <h3>Filtros aplicados:</h3>
            <p><strong>Estado:</strong> ${filterStatus === 'TODOS' ? 'Todos los estados' : filterStatus}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Participante</th>
                <th>Mes</th>
                <th>Monto</th>
                <th>Vencimiento</th>
                <th>Fecha Pago</th>
                <th>Estado</th>
                <th>Método de Pago</th>
              </tr>
            </thead>
            <tbody>
              ${filteredPayments.map(payment => {
                const statusClass = payment.estado === 'PAGADA' ? 'status-pagada' :
                                 payment.estado === 'PENDIENTE' ? 'status-pendiente' : 'status-vencida';
                return `
                  <tr>
                    <td>${payment.participante || 'N/A'}</td>
                    <td>${payment.mes || 'N/A'}</td>
                    <td>${formatCurrency(payment.monto || 0)}</td>
                    <td>${payment.fechaVencimiento ? formatDate(payment.fechaVencimiento) : 'N/A'}</td>
                    <td>${payment.fechaPago ? formatDate(payment.fechaPago) : '-'}</td>
                    <td class="${statusClass}">${normalizeStatus(payment.estado)}</td>
                    <td>${payment.metodoPago || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="stats">
            <h3>Estadísticas:</h3>
            <p><strong>Total de mensualidades:</strong> ${filteredPayments.length}</p>
            <p><strong>Pagadas:</strong> ${filteredPayments.filter(p => p.estado === 'PAGADA').length}</p>
            <p><strong>Pendientes:</strong> ${filteredPayments.filter(p => p.estado === 'PENDIENTE').length}</p>
            <p><strong>Vencidas:</strong> ${filteredPayments.filter(p => p.estado === 'VENCIDA').length}</p>
            <p><strong>Total recaudado:</strong> ${formatCurrency(filteredPayments.filter(p => p.estado === 'PAGADA').reduce((sum, p) => sum + (p.monto || 0), 0))}</p>
            <p><strong>Total pendiente:</strong> ${formatCurrency(filteredPayments.filter(p => p.estado !== 'PAGADA').reduce((sum, p) => sum + (p.monto || 0), 0))}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }, [filterStatus, filteredPayments]);

  const handleExportCSV = useCallback(() => {
    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'participante', label: 'Participante' },
      { key: 'mes', label: 'Mes' },
      { key: 'anio', label: 'Año' },
      { key: 'monto', label: 'Monto' },
      { key: 'monto_formateado', label: 'Monto (Formateado)' },
      { key: 'fecha_vencimiento', label: 'Fecha Vencimiento' },
      { key: 'fecha_pago', label: 'Fecha Pago' },
      { key: 'estado', label: 'Estado' },
      { key: 'metodo_pago', label: 'Método de Pago' },
      { key: 'comprobante', label: 'Comprobante' },
      { key: 'observaciones', label: 'Observaciones' }
    ];

    const csvData = filteredPayments.map(payment => ({
      id: payment.id || '',
      participante: payment.participante || '',
      mes: payment.mes || '',
      anio: payment.anio || '',
      monto: payment.monto || 0,
      monto_formateado: formatCurrencyForCSV(payment.monto || 0),
      fecha_vencimiento: formatDateForCSV(payment.fechaVencimiento),
      fecha_pago: formatDateForCSV(payment.fechaPago),
      estado: normalizeStatus(payment.estado),
      metodo_pago: payment.metodoPago || '',
      comprobante: payment.comprobante || '',
      observaciones: payment.observaciones || ''
    }));

    const csvContent = arrayToCSV(csvData, headers);
    const filename = `mensualidades_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  }, [filteredPayments]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      key: 'participante',
      label: 'Participante',
      render: (value) => (
        <span className="font-Poppins font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'mes',
      label: 'Mes',
      render: (value) => (
        <span className="font-Poppins text-gray-700">{value}</span>
      )
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) => (
        <span className="font-Poppins font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (value) => (
        <span className="font-Poppins text-gray-700">{formatDate(value)}</span>
      )
    },
    {
      key: 'fechaPago',
      label: 'Fecha Pago',
      render: (value) => (
        <span className="font-Poppins text-gray-700">
          {value ? formatDate(value) : '-'}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => {
        const statusConfig = {
          'PAGADA': { bg: 'bg-green-100', text: 'text-green-800', icon: 'fas fa-check-circle' },
          'PENDIENTE': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'fas fa-clock' },
          'VENCIDA': { bg: 'bg-red-100', text: 'text-red-800', icon: 'fas fa-exclamation-triangle' }
        };
        const config = statusConfig[value] || statusConfig['PENDIENTE'];
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-Poppins font-medium ${config.bg} ${config.text} flex items-center space-x-1 w-fit`}>
            <i className={`${config.icon} text-xs`}></i>
            <span>{value}</span>
          </span>
        );
      }
    },
    {
      key: 'metodoPago',
      label: 'Método',
      render: (value) => (
        <span className="font-Poppins text-gray-700">{value || '-'}</span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link
            to={`/dashboard/payments/${row.id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Ver detalles"
          >
            <i className="fas fa-eye"></i>
          </Link>
          {row.estado !== 'PAGADA' && (
            <button
              onClick={() => handleMarkAsPaid(row.id)}
              className="text-green-600 hover:text-green-800 transition-colors"
              title="Marcar como pagada"
            >
              <i className="fas fa-dollar-sign"></i>
            </button>
          )}
          <Link
            to={`/dashboard/payments/${row.id}/edit`}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
            title="Editar"
          >
            <i className="fas fa-edit"></i>
          </Link>
        </div>
      )
    }
  ];

  const handleMarkAsPaid = async (paymentId) => {
    try {
      // TODO: Implementation for marking payment as paid
      // await dbService.updatePaymentStatus(paymentId, 'PAGADO');
      await loadPayments();
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: payments.length,
      pagadas: payments.filter(p => p.estado === 'PAGADA').length,
      pendientes: payments.filter(p => p.estado === 'PENDIENTE').length,
      vencidas: payments.filter(p => p.estado === 'VENCIDA').length
    };
    
    const totalAmount = payments.reduce((sum, p) => sum + p.monto, 0);
    const paidAmount = payments.filter(p => p.estado === 'PAGADA').reduce((sum, p) => sum + p.monto, 0);
    
    return { ...stats, totalAmount, paidAmount };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebarOpen} isCollapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapsed} />
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} pt-20`}>
            <div className="flex items-center justify-center h-screen">
              <LoadingSpinner size="xl" text="Cargando mensualidades..." />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebarOpen} 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebarCollapsed} 
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} pt-20`}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-Lato font-bold text-gray-800">
                    Gestión de Mensualidades
                  </h1>
                  <p className="text-sm font-Poppins text-gray-600 mt-1">
                    Administra los pagos mensuales de los participantes
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-Poppins focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="TODOS">Todos los Estados</option>
                    <option value="PAGADA">Pagadas</option>
                    <option value="PENDIENTE">Pendientes</option>
                    <option value="VENCIDA">Vencidas</option>
                  </select>
                  <ExportDropdown
                    onExportPDF={handleExportPDF}
                    onExportCSV={handleExportCSV}
                  />
                  <Link
                    to="/dashboard/payments/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-Poppins font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <i className="fas fa-plus"></i>
                    <span>Registrar Pago</span>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-Poppins font-medium text-gray-600">Total Mensualidades</p>
                    <p className="text-3xl font-Lato font-bold text-blue-600 mt-2">
                      {stats.total}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                    <i className="fas fa-file-invoice-dollar text-blue-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-Poppins font-medium text-gray-600">Pagadas</p>
                    <p className="text-3xl font-Lato font-bold text-green-600 mt-2">
                      {stats.pagadas}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-Poppins font-medium text-gray-600">Pendientes</p>
                    <p className="text-3xl font-Lato font-bold text-yellow-600 mt-2">
                      {stats.pendientes}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                    <i className="fas fa-clock text-yellow-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-Poppins font-medium text-gray-600">Vencidas</p>
                    <p className="text-3xl font-Lato font-bold text-red-600 mt-2">
                      {stats.vencidas}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                    <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-Poppins font-medium text-gray-600">Total Recaudado</p>
                    <p className="text-lg font-Lato font-bold text-purple-600 mt-2">
                      {formatCurrency(stats.paidAmount)}
                    </p>
                    <p className="text-xs font-Poppins text-gray-500 mt-1">
                      de {formatCurrency(stats.totalAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                    <i className="fas fa-coins text-purple-600 text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <DataTable
              data={filteredPayments}
              columns={columns}
              searchable={true}
              sortable={true}
              pagination={true}
              pageSize={15}
              onRowClick={(payment) => {
                window.location.href = `/dashboard/payments/${payment.id}`;
              }}
              className="mb-8"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentsList;
