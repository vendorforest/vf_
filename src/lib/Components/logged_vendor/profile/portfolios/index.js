// @ts-nocheck
import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/withStyles";
import Carousel, { Modal as CarouselModal, ModalGateway } from 'react-images';
import { Card, Modal, Icon, Button, Pagination, message } from "antd";
import AddImage from "./AddImage";
import AddVideo from "./AddVideo";
import CustomCarouselView from './CustomCarouselView'
import CustomCarouselHeader from './CustomCarouselHeader'
import style from "./index.scss";
import { fetchPortfoliosData, updatePortfolios, fetchDeletePortfolio } from "../essential";
import { constants } from "@Shared/constants";
import PortfolioItem from "./PortfolioItem";


class VendorPortfolios extends React.Component {

	constructor(props) {

		super(props);

		this.state = {

			loading: false,

			isImageModal: false,

			isVideoModal: false,

			isCarousel: false,

			imgSrc: null,

			selectedPortfolio: null,

			selectedIndex: 0,

			portfolios: [],

			currentPage: 1,

			displayData: [],
		};

		this.imgFileRef = React.createRef();
	}

	componentDidMount() {

		if (this.props.user && this.props.user.accountType === constants.ACCOUNT_TYPE.VENDOR){

			if (this.props.portfolios){

				this.setState({

					portfolios: this.props.portfolios,
	
					displayData: this.props.portfolios.slice(0, 12)
				})
			}else{

				this.props.fetchPortfoliosData();
			}

		}else if (this.props.user && this.props.user.accountType !== constants.ACCOUNT_TYPE.VENDOR && this.props.selectedVendor){

			this.setState({

				portfolios: this.props.selectedVendor.portfolios,

				displayData: this.props.selectedVendor.portfolios.slice((currentPage - 1) * 12, currentPage * 12)
			})
		}
	}

	componentDidUpdate(prevProps){

		if (this.props.user && this.props.user.accountType === constants.ACCOUNT_TYPE.VENDOR ){

			const prevPortfolios = prevProps.portfolios || [], newPortfolios = this.props.portfolios || [];

			if (prevPortfolios.length !== newPortfolios.length) {

				const currentPage = this.props.portfolios.length < this.state.currentPage * 12 ? Math.ceil(this.props.portfolios.length / 12) : this.state.currentPage;
	
				this.setState({
	
					currentPage: currentPage,

					portfolios: this.props.portfolios,
	
					displayData: this.props.portfolios.slice((currentPage - 1) * 12, currentPage * 12)
				})
			}

		}
	}

	onSelectImageFile = (e) => {

		if (e.target.files && e.target.files.length > 0) {

			const reader = new FileReader();

			reader.addEventListener("load", () => {

				this.setState({ imgSrc: reader.result }, this.toggleImageModal);
			});

			reader.readAsDataURL(e.target.files[0]);

			e.target.value = null;
		}
	}


	toggleImageModal = () => {

		this.setState({ isImageModal: !this.state.isImageModal });
	}


	toggleVideoModal = () => {

		this.setState({ isVideoModal: !this.state.isVideoModal });
	}


	toggleCarouselModal = () => {

		this.setState({ isCarousel: !this.state.isCarousel });
	}


	addPortfolio = (portfolio) => {

		let newPortfolios = [...this.state.portfolios]

		newPortfolios.push(portfolio);

		this.props.updatePortfolios(newPortfolios)
	}

	getCouselSource = () =>{

		return this.state.portfolios.map(portfolio => {

			if (portfolio.type === constants.PORTFOLIO_TYPE.IMAGE){

				return { ...portfolio, caption: 'caption', url: this.getOriginSource(portfolio)};

			}else{

				return { ...portfolio, caption: 'caption', url: portfolio.url };
			}
		})
	}

	getOriginSource = (portfolio) => {

        if (portfolio.type === constants.PORTFOLIO_TYPE.IMAGE) {

            return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${portfolio.version}/${portfolio.public_id}`

        }else{

			return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/${portfolio.video_type}/${portfolio.public_id}`
        }
	}
	

	selectPortfolio = (portfolio) => {

		const index = this.state.portfolios.findIndex(pf => pf._id === portfolio._id);

		this.setState({

			selectedIndex: index,
			
			selectedPortfolio: this.state.portfolios[index]

		}, this.toggleCarouselModal)
	}

	deletePortfolio = (portfolio) => {

		if (this.state.loading) return;

		const index = this.state.portfolios.findIndex(pf => pf._id === portfolio._id);
		
		this.setState({loading: true})

		const params = {_id: portfolio._id}

		fetchDeletePortfolio(params).then(data => {

			this.setState({loading: false})

			const newPortfolios = [...this.state.portfolios]

			newPortfolios.splice(index, 1);

			this.props.updatePortfolios(newPortfolios)

			message.success(data.message)

		}).catch(error => { 

			console.log(error)

			this.setState({loading: false});
			
			message.error(error.message);
		})
	}

	onChangePagination = (page) => {

		this.setState({
	
			currentPage: page,

			displayData: this.state.portfolios.slice((page - 1) * 12, page * 12)
		})
	}

	render() {

		const isPublic = this.props.user ? false : true;


		const generateCards = () => {

			if (this.state.portfolios.length === 0) {

				return <h6 className="text-danger p-5 text-center w-100">No Portfolio</h6>;
			}

			return  this.state.displayData && this.state.displayData.map((portfolio, index) => {

				return <div className="col-md-3" key={index}>
					<PortfolioItem key={index} portfolio={portfolio} onClick={()=>{this.selectPortfolio(portfolio)}}/>
				</div>
			});
		}

		return (
			<div className="vendor-portfolio">
				<Card title={<span className="h5 font-weight-bold">Portfolio</span>} className="shadow" style={{ marginBottom: "50px" }}>
					{
						(this.props.pending || this.state.loading) && <div className="w-100 p-5 text-center loading-small"> <Icon type="sync" spin /></div>
					}
					<div className="d-flex upload-ctrls">
						<input type="file" accept="image/*" onChange={this.onSelectImageFile} hidden  ref={this.imgFileRef}/>
						<Button type="secondary" icon="upload" size={'large'} className="mr-1" onClick={()=>this.imgFileRef.current.click()}> Image </Button>
						<Button type="secondary" icon="upload" size={'large'} onClick={this.toggleVideoModal}> Video </Button>
					</div>
					{ 
						this.state.portfolios && 
						<div className="row mt-4">
							{generateCards()}
							{
								this.state.portfolios.length > 12 &&
								<div className="col-12 d-flex justify-content-end">
									<Pagination total={this.state.portfolios.length} 
										showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} 
										pageSize={12} defaultCurrent={this.state.currentPage}
										onChange={this.onChangePagination}
									/>
								</div>
							}
						</div>
					}
				</Card>
				{
					!isPublic && 
					<React.Fragment>
						<Modal title="Crop & Upload Image" visible={this.state.isImageModal} onCancel={this.toggleImageModal} width={"800px"} footer={null}>
							<AddImage src={this.state.imgSrc} toggle={this.toggleImageModal} addPortfolio={this.addPortfolio}/>
						</Modal>
						<Modal title="Upload Video" visible={this.state.isVideoModal} onCancel={this.toggleVideoModal} width={"800px"} footer={null}>
							<AddVideo src={this.state.imgSrc} toggle={this.toggleVideoModal} addPortfolio={this.addPortfolio}/>
						</Modal>
					</React.Fragment>
				}
				<ModalGateway>
				{
					this.state.isCarousel &&
					<CarouselModal onClose={this.toggleCarouselModal} closeOnBackdropClick ={true} >
						<Carousel 
							views={this.getCouselSource()} 
							currentIndex={this.state.selectedIndex}
							onClose={this.toggleCarouselModal} 
							onDelete={this.deletePortfolio}
							components={{ 
								View: CustomCarouselView, 
								Header: props => ( <CustomCarouselHeader {...props} /> )
							}}
							onClose={this.toggleCarouselModal} 
						/>
					</CarouselModal>
				}
                </ModalGateway>
			</div>
		);
	}
}



const mapStateToProps = ({ vendorProfileReducer }) => {

	const { error, portfolios, user, pending, selectedVendor } = vendorProfileReducer;

	return { error, portfolios, pending, user, selectedVendor };
};


export default connect(mapStateToProps, {

	fetchPortfoliosData,

	updatePortfolios

})(withStyles(style)(VendorPortfolios));
