import React ,{ useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/auth';
import { useParams } from "react-router-dom";
import axios from "../lib/axios";
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import InputError from '../components/InputError';


import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


const Usuario = () => {
    const { logout, token } = useAuth();
    const { id } = useParams();
 let emptyUser = {
        id: null,
        password: '',
        url: '',
    };

    const [users, setUsers] = useState(null);
    const [image, setImage] = useState('');
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [errors, setErrors] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

  
    async function deleteUser(users, mode = 'single') {
        try {
            const endpoint = mode === 'single' ? `/api/images/${users.id}` : `/api/usuariosList/${users}`;
            const response = await axios.delete(endpoint);

            if (response.status === 204) {
                mode === 'single' ? deletedUser(users.id) : deletedSelectedUsers(users);
            } else {
                throw new Error(mode === 'single' ? 'Error al eliminar el usuario' : 'Error al eliminar los usuarios');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }


    const editUser = async (id) => {
     
         try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', user.name);
            formData.append('email', user.email);
            formData.append('rol', user.rol);
            formData.append('status', user.status);
            formData.append('phone', user.phone);
             const response = await axios.post(`/api/usuarios/${id}?_method=PATCH`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
             if (response.status == 200) {
                 saveUser(response.data.user);
             } else {
                 // If a valid response is received but with an error status:
                 toast.current.show({
                     severity: 'error',
                     summary: 'Error',
                     detail: 'Error al actualizar el usuario',
                     life: 3000,
                 });
             }
         } catch (error) {
             // If no response is received (network/server-side errors):
             console.error('Error updating user:', error);
             if (error.response) {
                 // If a response was eventually received:
                 if (error.response.status === 422) {
                     setErrors(error.response.data.errors);
                 } else {
                     // Handle other error codes appropriately
                     toast.current.show({
                         severity: 'error',
                         summary: 'Error',
                         detail: 'Error desconocido al actualizar el usuario',
                         life: 3000,
                     });
                 }
             } else if (error.request) {
                 // If the request never reached the server
                 toast.current.show({
                     severity: 'error',
                     summary: 'Error',
                     detail: 'Problema de conexión al servidor',
                     life: 3000,
                 });
             } else {
                 // Unexpected error during setup
                 console.error('Unexpected error:', error);
             }
         } 
    }
    const createUser = async (user) => {
        
        try {
            const formData = new FormData();
            formData.append('images', image);
            formData.append('password', user.password);
            formData.append('id', id);
            console.log("--");
            console.log(image);
            console.log(user.password);
            console.log(id)
            console.log("--");
            const response = await axios.post('/api/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                const newUser = response.data.user;
                getUsers(id);
                setUser(emptyUser);
                setUserDialog(false);
            } else {

                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al crear el usuario',
                    life: 3000,
                });
            }
        } catch (error) {
            // If no response is received (network/server-side errors):
            console.error('Error creating user:', error);
            if (error.response) {
                // If a response was eventually received:
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    // Handle other error codes appropriately
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error desconocido al crear el usuario',
                        life: 3000,
                    });
                }
            } else if (error.request) {
                // If the request never reached the server
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Problema de conexión al servidor',
                    life: 3000,
                });
            } else {
                // Unexpected error during setup
                console.error('Unexpected error:', error);
            }
        }
    };

    const getUsers = async (id) => {

        axios.get('/api/usuario/'+id)
            .then(res => {
                setUsers(res.data);
            })
            .catch(error => {
                if (error.response && error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    useEffect(() => {
        getUsers(id);
    }, [])

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };


    const saveUser = (newUser) => {

        setSubmitted(true);
        if (user) {
            console.log(newUser);
            let _users = [...users];
            let _user = newUser;

            if (user.id) {
                const index = findIndexById(user.id);
                _users[index] = _user;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } else {
                _users.push(_user);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            }

            setUsers(_users);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editingUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deletedUser = (id) => {
        let _users = users.filter((val) => val.id !== id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };
    const deleteSelectedUsers = () => {
        const todelete = selectedUsers.map(user => user.id);
        deleteUser(todelete, 'array');
    }

    const deletedSelectedUsers = (ToDelete) => {
        let _users = users.filter((user) => !ToDelete.includes(user));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    };
    const onStatusChange = (e) => {
        let _user = { ...user };
        _user['status'] = e.value;
        setUser(_user)
    }
    const onRolChange = (e) => {
        let _user = { ...user };

        _user['rol'] = e.value;
        setUser(_user);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
    };

/*     const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
    }; */

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Logout" icon="pi pi-on" className="p-button-help" onClick={logout} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`http://127.0.0.1:8000/${rowData.url}`} className="shadow-2 border-round" style={{ width: '250px' }} />;
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
           
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (user) => {
        switch (user.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Users</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={() => { user.id != null ? editUser(user.id) : createUser(user) }} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => { deleteUser(user) }} />
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => { deleteSelectedUsers() }} />
        </React.Fragment>
    );

    return (
        <div>
           <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
                        dataKey="id"  paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="url" header="Url" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="url" header="Image" body={imageBodyTemplate}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                {user.id && <img src={'http://127.0.0.1:8000/'+user.url} alt={user.url} className="user-image block m-auto pb-3" id="image"/>}
                <InputText type="file" accept="image/*" id="image" label="Upload Image" onChange={(e) => setImage(e.target.files[0]) } />

                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Password
                    </label>
                    <InputText id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                    {submitted && !user.password && <small className="p-error">Debe insgresar su password.</small>}
                    <InputError messages={errors.password} className="mt-2" />
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && (
                        <span>
                            Are you sure you want to delete <b>{user.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Are you sure you want to delete the selected users?</span>}
                </div>
            </Dialog>
        </div>
    );
}
export default Usuario;

/* 
 */