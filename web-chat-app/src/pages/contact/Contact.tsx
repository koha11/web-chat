import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Modal, Ripple, initTWE } from 'tw-elements';
import { getData } from '../../services/api';

const Contact = () => {
  const [contactList, setContactList] = useState([]);
  const [onlineList, setOnlineList] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    getData('/contact/get-all').then((data) => {
      setContactList(data);
    });
    getData('/contact/get-online').then((data) => {
      setOnlineList(data);
    });

    initTWE({ Modal, Ripple });
  }, []);

  return (
    <div className="flex justify-center text-black h-screen">
      <div className="container flex bg-white gap-4 py-4">
        <section
          className="w-[25%] h-full p-2 bg-white rounded-2xl"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0 0 5px 2px' }}
        >
          <div className="flex justify-between items-center h-[10%] px-2">
            <div className="text-xl">
              <a href="/m" className="">
                <i className="bx bx-arrow-back p-2 rounded-full bg-gray-200 hover:opacity-50"></i>
              </a>
            </div>
            <h1 className="text-2xl font-bold">Danh sách hoạt động</h1>
          </div>

          <nav id="chat-box-list" className="h-[90%] overflow-y-scroll">
            {onlineList.map((user: ContactType) => (
              <NavLink to={'/m/' + user.chatID} className={'flex'}>
                {user.fullname}
              </NavLink>
            ))}
          </nav>
        </section>
        <section
          className="w-[75%] h-full p-4 bg-white rounded-2xl"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0 0 5px 2px' }}
        >
          <div className="h-[10%] flex items-center py-4 px-2 gap-4">
            <form action="" className="relative flex-auto">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
                placeholder="Tìm kiếm liên hệ"
              ></input>
              <i className="bx bx-search absolute left-3 top-[50%] translate-y-[-50%] text-gray-500"></i>
            </form>

            <button
              className="rounded-xl bg-blue-200 hover:opacity-50 cursor-pointer"
              data-twe-toggle="modal"
              data-twe-target="#exampleModal"
              data-twe-ripple-init
              data-twe-ripple-color="light"
            >
              <i className="bx bx-plus text-xl p-3"></i>
            </button>

            <div
              data-twe-modal-init
              className="fixed right-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-[rgba(0,0,0,0.3)]"
              id="exampleModal"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div
                data-twe-modal-dialog-ref
                className="w-1/3 translate-x-[calc(1/3*100%)] translate-y-[500%] bg-white"
              >
                <div>Thêm liên hệ mới</div>
                <hr></hr>
                <div>
                  <input placeholder="Số điện thoại"></input>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[10%] flex items-center py-4 px-2">
            <div>SORT</div>
          </div>
          <div className="h-[80%] grid grid-cols-2 gap-4 auto-rows-min px-2">
            {contactList.map((user: ContactType) => (
              <div
                className={
                  'flex h-30 shadow rounded-2xl justify-center items-center px-4'
                }
              >
                <div
                  className="rounded-2xl h-22 w-22 bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(/assets/images/test.jpg)` }}
                ></div>
                <div className="flex-auto px-4">
                  <div className="font-bold">{user.fullname}</div>
                  <div className="">{user.username}</div>
                </div>
                <div>
                  <a href="#">
                    <i className="bx bx-dots-horizontal-rounded p-2 rounded-full hover:bg-gray-200 font-bold text-xl"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

type ContactType = {
  id: String;
  chatID: String;
  username: String;
  fullname: String;
  isOnline: Boolean;
};

export default Contact;
