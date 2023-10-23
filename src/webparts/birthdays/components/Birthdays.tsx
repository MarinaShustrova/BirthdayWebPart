import { Component } from 'react';
import * as React from 'react';
import styles from './Birthdays.module.scss';


const placeholderImageUrl = "https://o-tendencii.com/uploads/posts/2022-02/1645667191_55-o-tendencii-com-p-tort-s-odnoi-svechkoi-foto-72.jpg"

export interface IBirthdaysProps {
  data: IBDZUPList[];
  defaultImage: string;
  title: string;
}

export interface IBDZUPList {
  Surname: string;
  Name: string;
  MiddleName: string;
  Post: string;
  Division: string;
  Place: string;
  Focus: boolean;
  Foto: string;

}

export interface IBirthdaysState {
  showModal: boolean;
  selectedEmployee: IBDZUPList | null;
  showAllBirthdays: boolean;
  title: string;

}

class Birthdays extends Component<IBirthdaysProps, IBirthdaysState> {
  constructor(props: IBirthdaysProps) {
    super(props);
    this.state = {
      showModal: false,
      selectedEmployee: null,
      showAllBirthdays: false,
      title: props.title,

    };
  }

  componentDidUpdate(prevProps: IBirthdaysProps) {
    if (prevProps.title !== this.props.title) {
      // Update title in component state when props change
      this.setState({ title: this.props.title });
    }
  }

  openModal = (employee: IBDZUPList) => {
    this.setState({ showModal: true, selectedEmployee: employee });
  };

  closeModal = () => {
    this.setState({ showModal: false, selectedEmployee: null });
  };

  decodeBase64Image = (base64String: string) => {
    const decodedData = atob(base64String);
    const dataType = 'Foto';
    const uint8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      uint8Array[i] = decodedData.charCodeAt(i);
    }
    return URL.createObjectURL(new Blob([uint8Array], { type: dataType }));
  };

  toggleShowAllBirthdays = () => {
    this.setState((prevState) => ({
      showAllBirthdays: !prevState.showAllBirthdays,
    }));
  };

  render() {
    const { data, defaultImage } = this.props;
    const { showModal, selectedEmployee, showAllBirthdays, title } = this.state;

    // Sort the data based on the 'Focus' flag
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a.Focus && !b.Focus) {
        return -1;
      } else if (!a.Focus && b.Focus) {
        return 1;
      } else {
        return 0;
      }
    });

    const displayedBirthdays = showAllBirthdays ? sortedData : sortedData.slice(0, 2);

    return (
      <div className={styles.birthdays}>
        <div className={styles.container}>
        <span className={styles.title}>{ 'Поздравляем с Днем Рождения!' || this.props.title }</span>
          {displayedBirthdays.length > 0 ? (
            displayedBirthdays.map((item: IBDZUPList) => (
              <div
                className={styles.card}
                key={item.Surname}
                onClick={() => this.openModal(item)}
              >
                <div className={styles.photoContainer}>
                  {item.Foto ? (
                    <img
                      src={this.decodeBase64Image(item.Foto) || placeholderImageUrl}
                      alt="Employee Photo"
                      className={styles.photo}
                    />
                  ) : (
                    <img
                      src={defaultImage || placeholderImageUrl}
                      alt="Employee Photo"
                      className={styles.photo}
                    />
                  )}
                </div>

                <div >
                    <div className={styles.nameContainer}>{item.Surname}&nbsp;{item.Name}&nbsp;{item.MiddleName} </div>
                     <div>
                    <div className={styles.detailsNameContainer }>{item.Post},&nbsp;{item.Place}</div>
                  </div>
                  </div>
                </div>

            ))
          ) : (
            <div>Скоро здесь будут именинники!</div>
          )}

          {!showAllBirthdays && sortedData.length > 3 && (
            <button className={styles.expandButton} onClick={this.toggleShowAllBirthdays}>
              Развернуть
            </button>
          )}

          {showAllBirthdays && (
            <button className={styles.expandButton} onClick={this.toggleShowAllBirthdays}>
              Свернуть
            </button>
          )}
        </div>

        {showModal && selectedEmployee && (
          <div className={styles.modal} onClick={this.closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.card}>
                <div className={styles.photoContainer}>
                  {selectedEmployee.Foto ? (
                    <img
                      src={this.decodeBase64Image(selectedEmployee.Foto) || placeholderImageUrl}
                      alt="Employee Photo"
                      className={styles.photo}
                    />
                  ) : (
                    <img
                      src={defaultImage || placeholderImageUrl}
                      alt="Employee Photo"
                      className={styles.photo}
                    />
                  )}
                </div>
                <div className={styles.nameModalContainer}>
                  <div className={styles.nameHeader}>{selectedEmployee.Surname} </div>
                  <div className={styles.name}>{selectedEmployee.Name}</div>
                  <div className={styles.middlename}>{selectedEmployee.MiddleName}</div>
                </div>
              </div>
              <div className={styles.details}>
                <div className={styles.post}>{selectedEmployee.Post}</div>
                <div className={styles.division}>{selectedEmployee.Division}</div>
                <div className={styles.place}>{selectedEmployee.Place}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Birthdays;
