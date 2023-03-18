import React, { useContext, useState } from "react";
import * as yup from "yup";
import { Form, Formik } from "formik";
import TextInput from "../common/TextInput";

import { uploadImageToIPFS, uploadJSONToIPFS } from "../../services/pinata";
import { Button, Input, TextField } from "@mui/material";
import { ContractContext, SnackbarContext } from "../../App";
import BackdropProgress from "../common/BackdropProgress";
import currentUnixTimestamp from "../../helpers/currentUnixTimestamp";

const CreateForm = ({ closeModal, setProgressOpen }) => {
  const [image, setImage] = useState();
  const contractContext = useContext(ContractContext);
  const setSnackbarProps = useContext(SnackbarContext);
  // console.log(contract);

  const onImageSelect = async (e) => {
    console.log("inside onchange file");
    const file = e.target.files[0];
    setImage(file);
  };

  const onFormSubmit = async (values) => {
    try {
      if (image) {
        closeModal();
        setProgressOpen(true);
        const { nftTitle, nftDescription } = values;
        const mintedDate = currentUnixTimestamp();
        const imgUrl = await uploadImageToIPFS(image);
        const jsonData = { nftTitle, nftDescription, mintedDate, imgUrl };
        const metaDataUrl = await uploadJSONToIPFS(jsonData);
        const transaction = await contractContext.contract.createToken(
          metaDataUrl
        );
        await transaction.wait();
        setSnackbarProps({
          open: true,
          message: " NFT minted successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
      setSnackbarProps({
        open: true,
        message: " NFT minting unsuccessfull",
        type: "error",
      });
    } finally {
      setProgressOpen(false);
    }
  };

  const initialValues = {
    nftTitle: "",
    nftDescription: "",
  };
  const formikProps = {
    initialValues: initialValues,
    onSubmit: onFormSubmit,
    validationSchema: yup.object({
      nftTitle: yup.string().required("Please add campaign title"),
      nftDescription: yup.string().required("Please add campaign description"),
    }),
  };

  return (
    <>
      <Formik {...formikProps}>
        {({ errors, touched }) => {
          return (
            <Form>
              <TextInput
                name="nftTitle"
                label="Nft Title"
                type="name"
                error={errors.campaignTitle}
                touched={touched.campaignTitle}
              />

              <TextInput
                name="nftDescription"
                label="NFT Description"
                type="name"
                error={errors.campaignDescription}
                touched={touched.campaignDescription}
                multiline
              />

              <Input type={"file"} onChange={onImageSelect}></Input>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Mint
              </Button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default CreateForm;
